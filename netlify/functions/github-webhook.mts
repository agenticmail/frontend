import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { createAppAuth } from "@octokit/auth-app";
import { request } from "@octokit/request";
import Anthropic from "@anthropic-ai/sdk";

/**
 * AgenticMail for GitHub — webhook handler.
 *
 * Receives every webhook GitHub sends from installations of the
 * "AgenticMail for GitHub" Marketplace App. The route is registered
 * on the App's settings page at
 *   https://agenticmail.io/api/github/webhook
 *
 * Contract (from github-app/design.md §3.1):
 *   verify HMAC-SHA256 → dedup by X-GitHub-Delivery UUID → 202 in <100ms
 *   → background: fetch thread context → invoke agent → post comment
 *
 * The "background" stage runs in the same function via context.waitUntil
 * so Netlify keeps the function alive for up to 15 s after the response
 * goes out — long enough for one Anthropic call + one GitHub comment post.
 * If the agent needs longer, the design has a backpressure escape (post
 * "still working…" comment, kick a second function) but v1 hits well
 * under 15 s in practice.
 *
 * Persistent state lives in two Netlify Blob stores:
 *   github-webhook-dedup    — delivery UUID → seen-at-ms, 5 min TTL
 *   github-installations    — installation_id → { account, type, repos, installedAt }
 *
 * Secrets (Netlify env vars, set under Site → Site configuration → Environment):
 *   GITHUB_APP_ID                — the numeric App ID
 *   GITHUB_APP_PRIVATE_KEY       — PEM-encoded RSA private key (multi-line ok)
 *   GITHUB_WEBHOOK_SECRET        — random string set on the App's webhook config
 *   ANTHROPIC_AUTH_TOKEN         — Claude OAuth token (sk-ant-oat01-…) — preferred
 *     OR
 *   ANTHROPIC_API_KEY            — classic API key (sk-ant-api03-…)
 *
 * The SDK reads ANTHROPIC_AUTH_TOKEN automatically when constructed without
 * explicit creds; we still pass it explicitly so a missing env var fails
 * loudly in `generateReply` rather than at the first SDK call.
 */

const DEDUP_STORE = "github-webhook-dedup";
const INSTALL_STORE = "github-installations";
const DEDUP_TTL_MS = 5 * 60 * 1000;

// ─── HMAC verification ─────────────────────────────────────────────────────
//
// Constant-time compare against the sha256 HMAC of the RAW request bytes.
// Re-serializing JSON wouldn't preserve key order → HMAC would mismatch, so
// we read the body as text once and hash that exact string.

async function verifySignature(rawBody: string, signature: string | null, secret: string): Promise<boolean> {
  if (!signature || !signature.startsWith("sha256=")) return false;
  const provided = signature.slice("sha256=".length);

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  const expected = Array.from(new Uint8Array(sigBuf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time compare — both strings the same length, byte-by-byte XOR.
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

// ─── Mention parser ────────────────────────────────────────────────────────
//
// Per design.md §7.1: first-mention-wins, case-insensitive trigger, verb is
// the first token after the mention, args are the rest of that line.

interface MentionCommand {
  verb: "summarize" | "triage" | "email" | "reply" | "handoff" | "link";
  args: string;
}

const VALID_VERBS = new Set(["summarize", "triage", "email", "reply", "handoff", "link"]);

function parseMention(body: string): MentionCommand | null {
  if (!body || !body.toLowerCase().includes("@agenticmail")) return null;
  // Anchor on the first @agenticmail and look at the rest of THAT line only.
  const lines = body.split("\n");
  for (const line of lines) {
    const m = line.match(/(^|\s)@agenticmail\b\s*(.*)/i);
    if (!m) continue;
    const rest = (m[2] || "").trim();
    if (rest.length === 0) return { verb: "summarize", args: "" };
    const tokens = rest.split(/\s+/);
    const first = tokens[0].toLowerCase();
    if (VALID_VERBS.has(first)) {
      let args = tokens.slice(1).join(" ").trim();
      // "handoff to <name>" → strip the leading "to"
      if (first === "handoff" && args.toLowerCase().startsWith("to ")) {
        args = args.slice(3).trim();
      }
      return { verb: first as MentionCommand["verb"], args };
    }
    // No matching verb but mention present — default to summarize.
    return { verb: "summarize", args: rest };
  }
  return null;
}

// ─── Installation-scoped Octokit auth ──────────────────────────────────────
//
// Each App installation gets a short-lived (60 min) token. We mint it on
// demand here; no caching across function invocations (each cold start is a
// fresh process). On a hot Lambda this could be cached in module scope, but
// for the volumes a v1 Marketplace App sees this is fine.

async function getInstallationToken(installationId: number): Promise<string> {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
  if (!appId || !privateKey) throw new Error("Missing GITHUB_APP_ID or GITHUB_APP_PRIVATE_KEY env");
  const auth = createAppAuth({
    appId,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  });
  const installation = await auth({ type: "installation", installationId });
  return installation.token;
}

// ─── Agent call (Anthropic direct, v1) ─────────────────────────────────────
//
// v1 keeps it serverless-pure: no callback into an enterprise instance,
// just an Anthropic call with the thread context. v2 will route to the
// installing customer's enterprise instance via the subdomain-registry
// mapping (installation.account.login → that org's claimed subdomain) for
// per-customer agent personas + memory.

async function generateReply(verb: string, args: string, thread: {
  repo: string;
  kind: "issue" | "pull_request";
  number: number;
  title: string;
  body: string;
  comments: Array<{ user: string; body: string }>;
  triggerUser: string;
}): Promise<string> {
  // Prefer the OAuth token (sk-ant-oat01-…) since Ope's stack already
  // mints one for Claude Code; fall back to a classic API key
  // (sk-ant-api03-…) if that's what the operator provisioned. The SDK
  // exposes both via `authToken` and `apiKey` respectively; passing the
  // wrong field for the wrong token shape produces a 401 from
  // Anthropic, hence the prefer-oauth + explicit-else routing.
  const authToken = process.env.ANTHROPIC_AUTH_TOKEN;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!authToken && !apiKey) {
    return `Agent unavailable: neither \`ANTHROPIC_AUTH_TOKEN\` nor \`ANTHROPIC_API_KEY\` is configured on the webhook host.`;
  }
  const client = authToken
    ? new Anthropic({
        authToken,
        // OAuth tokens require the beta header to authorize the
        // messages endpoint. The SDK doesn't add it automatically
        // because not every OAuth-token holder is on the same beta
        // surface, so we set it explicitly here.
        defaultHeaders: { 'anthropic-beta': 'oauth-2025-04-20' },
      })
    : new Anthropic({ apiKey: apiKey! });

  const systemPrompt = [
    "You are @agenticmail — an AI assistant that responds to mentions in GitHub issue and PR threads.",
    "Reply in Markdown. Be concise. Don't fabricate links or code. If you can't help, say so.",
    "Always end your reply with: \"\\n\\n— [AgenticMail](https://agenticmail.io) · " + verb + "\"",
  ].join("\n");

  const threadStr = [
    `Repo: ${thread.repo}`,
    `${thread.kind === "issue" ? "Issue" : "Pull request"} #${thread.number}: ${thread.title}`,
    "",
    "ORIGINAL POST:",
    thread.body || "(empty)",
    "",
    ...(thread.comments.length > 0 ? [
      "COMMENT THREAD (oldest → newest):",
      ...thread.comments.map(c => `[@${c.user}]: ${c.body}`),
      "",
    ] : []),
    `MENTION FROM: @${thread.triggerUser}`,
    `VERB: ${verb}`,
    args ? `ARGS: ${args}` : "",
  ].filter(Boolean).join("\n");

  const verbInstruction = {
    summarize: "Write a 2-paragraph summary of this thread (what's being asked / decided, current status).",
    triage: "Suggest labels (as a markdown list), a priority (low/medium/high/urgent), and whether this looks like a duplicate of any other issue. Do not apply labels — only suggest.",
    email: `The user wants this thread emailed to: ${args}. Confirm by composing a short subject line + a clean plain-text body that captures the thread for that recipient. Do not include any embedded links to internal tools.`,
    reply: `Draft a reply following this direction: "${args}". Stay on-topic with the thread.`,
    handoff: `The user is handing this thread off to agent: ${args}. Acknowledge the handoff in a comment.`,
    link: "Look for what other issues in this repo might be related (you can reference issue numbers you see in the comment thread, but don't invent numbers). If nothing is clearly related, say so.",
  }[verb] || "Summarize the thread.";

  const msg = await client.messages.create({
    model: "claude-3-5-haiku-latest",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      { role: "user", content: `${threadStr}\n\n---\n\n${verbInstruction}` },
    ],
  });
  const block = msg.content.find(b => b.type === "text");
  return block && block.type === "text" ? block.text : "(no reply generated)";
}

// ─── Background processor ─────────────────────────────────────────────────

async function processWebhook(event: string, payload: any, deliveryId: string): Promise<void> {
  try {
    // Branch by event. Only do work on the events the App is subscribed to.
    if (event === "issue_comment" && payload.action === "created") {
      await handleIssueComment(payload);
    } else if (event === "pull_request_review_comment" && payload.action === "created") {
      await handlePRReviewComment(payload);
    } else if (event === "issues" && payload.action === "opened") {
      await handleIssueOpened(payload);
    } else if (event === "pull_request" && payload.action === "opened") {
      await handlePROpened(payload);
    } else if (event === "installation" && payload.action === "created") {
      await handleInstallationCreated(payload);
    } else if (event === "installation" && payload.action === "deleted") {
      await handleInstallationDeleted(payload);
    }
  } catch (err: any) {
    console.error(`[github-webhook] processing failed for ${event} ${deliveryId}:`, err?.message ?? err);
  }
}

async function handleIssueComment(payload: any): Promise<void> {
  if (payload.comment?.user?.type === "Bot") return; // self-loop guard
  const cmd = parseMention(payload.comment?.body ?? "");
  if (!cmd) return;
  const installationId = payload.installation?.id;
  const repoFull = payload.repository?.full_name;
  if (!installationId || !repoFull) return;
  const [owner, repo] = repoFull.split("/");
  const token = await getInstallationToken(installationId);
  // Drop a 👀 reaction so the user sees "got it" immediately.
  await request("POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
    headers: { authorization: `token ${token}` },
    owner, repo, comment_id: payload.comment.id,
    content: "eyes",
  }).catch(() => {});
  // Pull recent comments for context.
  const comments = await fetchIssueComments(token, owner, repo, payload.issue.number);
  const reply = await generateReply(cmd.verb, cmd.args, {
    repo: repoFull,
    kind: payload.issue.pull_request ? "pull_request" : "issue",
    number: payload.issue.number,
    title: payload.issue.title ?? "",
    body: payload.issue.body ?? "",
    comments,
    triggerUser: payload.comment.user.login,
  });
  await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    headers: { authorization: `token ${token}` },
    owner, repo, issue_number: payload.issue.number,
    body: reply,
  });
}

async function handlePRReviewComment(payload: any): Promise<void> {
  if (payload.comment?.user?.type === "Bot") return;
  const cmd = parseMention(payload.comment?.body ?? "");
  if (!cmd) return;
  const installationId = payload.installation?.id;
  const repoFull = payload.repository?.full_name;
  if (!installationId || !repoFull) return;
  const [owner, repo] = repoFull.split("/");
  const token = await getInstallationToken(installationId);
  const reply = await generateReply(cmd.verb, cmd.args, {
    repo: repoFull,
    kind: "pull_request",
    number: payload.pull_request.number,
    title: payload.pull_request.title ?? "",
    body: payload.pull_request.body ?? "",
    comments: [{ user: payload.comment.user.login, body: payload.comment.body }],
    triggerUser: payload.comment.user.login,
  });
  // Reply on the same conversation, not as a new review thread (simpler v1).
  await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    headers: { authorization: `token ${token}` },
    owner, repo, issue_number: payload.pull_request.number,
    body: reply,
  });
}

async function handleIssueOpened(payload: any): Promise<void> {
  const installationId = payload.installation?.id;
  const repoFull = payload.repository?.full_name;
  if (!installationId || !repoFull) return;
  const [owner, repo] = repoFull.split("/");
  const token = await getInstallationToken(installationId);
  const reply = await generateReply("triage", "", {
    repo: repoFull,
    kind: "issue",
    number: payload.issue.number,
    title: payload.issue.title ?? "",
    body: payload.issue.body ?? "",
    comments: [],
    triggerUser: payload.issue.user?.login ?? "unknown",
  });
  await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    headers: { authorization: `token ${token}` },
    owner, repo, issue_number: payload.issue.number,
    body: reply,
  });
}

async function handlePROpened(payload: any): Promise<void> {
  const installationId = payload.installation?.id;
  const repoFull = payload.repository?.full_name;
  if (!installationId || !repoFull) return;
  const [owner, repo] = repoFull.split("/");
  const token = await getInstallationToken(installationId);
  const reply = await generateReply("summarize", "", {
    repo: repoFull,
    kind: "pull_request",
    number: payload.pull_request.number,
    title: payload.pull_request.title ?? "",
    body: payload.pull_request.body ?? "",
    comments: [],
    triggerUser: payload.pull_request.user?.login ?? "unknown",
  });
  await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    headers: { authorization: `token ${token}` },
    owner, repo, issue_number: payload.pull_request.number,
    body: reply,
  });
}

async function handleInstallationCreated(payload: any): Promise<void> {
  const store = getStore(INSTALL_STORE);
  await store.set(String(payload.installation.id), JSON.stringify({
    account: payload.installation.account?.login,
    type: payload.installation.account?.type,
    repoSelection: payload.installation.repository_selection,
    repos: (payload.repositories ?? []).map((r: any) => r.full_name),
    installedAt: new Date().toISOString(),
  })).catch(() => {});
}

async function handleInstallationDeleted(payload: any): Promise<void> {
  const store = getStore(INSTALL_STORE);
  await store.delete(String(payload.installation.id)).catch(() => {});
}

async function fetchIssueComments(token: string, owner: string, repo: string, issueNumber: number): Promise<Array<{ user: string; body: string }>> {
  try {
    const res = await request("GET /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      headers: { authorization: `token ${token}` },
      owner, repo, issue_number: issueNumber,
      per_page: 20,
    });
    return (res.data ?? []).map((c: any) => ({
      user: c.user?.login ?? "unknown",
      body: c.body ?? "",
    }));
  } catch {
    return [];
  }
}

// ─── Entrypoint ────────────────────────────────────────────────────────────

export default async function handler(req: Request, context: Context): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return new Response(JSON.stringify({ error: "webhook secret not configured" }), { status: 500 });
  }

  const rawBody = await req.text();
  const sig = req.headers.get("x-hub-signature-256");
  const verified = await verifySignature(rawBody, sig, secret);
  if (!verified) {
    return new Response(JSON.stringify({ error: "bad signature" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const event = req.headers.get("x-github-event") ?? "";
  const deliveryId = req.headers.get("x-github-delivery") ?? "";

  // Delivery dedup. GitHub retries — same delivery UUID arrives 2-3×.
  if (deliveryId) {
    const dedup = getStore(DEDUP_STORE);
    const seen = await dedup.get(deliveryId).catch(() => null);
    if (seen) {
      return new Response(JSON.stringify({ ok: true, deduped: true }), {
        status: 202,
        headers: { "content-type": "application/json" },
      });
    }
    await dedup.set(deliveryId, String(Date.now()), {
      metadata: { ttl_ms: DEDUP_TTL_MS },
    }).catch(() => {});
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: "malformed payload" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // Hand off to background work — Netlify lets the function keep running
  // for up to 15s after the response is sent if we await this here, OR
  // if the runtime supports waitUntil we use that. For broad compat we
  // just fire-and-forget — any error inside is caught + logged.
  const work = processWebhook(event, payload, deliveryId);
  // Netlify's Context exposes waitUntil on newer runtimes; older ones
  // run async work in the background as long as the Lambda is alive.
  const ctxWithWait = context as { waitUntil?: (p: Promise<unknown>) => void };
  if (typeof ctxWithWait.waitUntil === "function") ctxWithWait.waitUntil(work);
  else void work.catch(() => {});

  return new Response(JSON.stringify({ ok: true, delivery: deliveryId, event }), {
    status: 202,
    headers: { "content-type": "application/json" },
  });
}

export const config = {
  path: "/api/github/webhook",
};
