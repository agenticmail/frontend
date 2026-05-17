import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { createAppAuth } from "@octokit/auth-app";
import { request } from "@octokit/request";
import Anthropic from "@anthropic-ai/sdk";
import {
  parseMention,
  PAID_VERB_SET,
  helpMessage,
  type MentionCommand,
} from "./_lib/parse-mention.js";

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
const AUDIT_STORE = "github-webhook-audit";
const RATE_STORE = "github-rate-limit";
const BILLING_STORE = "github-billing";
const DEDUP_TTL_MS = 5 * 60 * 1000;

// Per-installation rate limit. The bot is free, but Anthropic inference
// isn't — a runaway loop or abuse could drain the OAuth quota attached to
// this deployment. 60 user-triggered mentions per rolling hour per
// installation is generous for genuine use, hostile to spam.
const RATE_LIMIT_PER_HOUR = 60;
const RATE_WINDOW_MS = 60 * 60 * 1000;

// ─── Audit log ──────────────────────────────────────────────────────────────
//
// Every webhook delivery — accepted, deduped, rejected, errored — writes one
// JSON line to the audit store keyed by `<iso-day>/<delivery-uuid>`. This is
// what lets us answer "did GitHub's reviewer event arrive?" and
// "why didn't the bot reply to X?" without trawling Netlify function logs.
//
// Failures here are swallowed — we never want a logging error to bring down
// webhook processing.

interface AuditEntry {
  ts: string;
  deliveryId: string;
  event: string;
  action?: string;
  installationId?: number;
  repo?: string;
  status: "accepted" | "deduped" | "bad_signature" | "rate_limited" | "processed" | "failed" | "ignored";
  latencyMs?: number;
  error?: string;
  extra?: Record<string, unknown>;
}

async function writeAudit(entry: AuditEntry): Promise<void> {
  try {
    const store = getStore(AUDIT_STORE);
    const day = entry.ts.slice(0, 10); // YYYY-MM-DD
    const key = `${day}/${entry.deliveryId || `unknown-${Date.now()}`}`;
    await store.set(key, JSON.stringify(entry));
  } catch {
    /* never throw from the logger */
  }
}

// ─── Rate limiter ──────────────────────────────────────────────────────────
//
// Fixed-window token bucket keyed by installation ID. Cheap and good enough
// for v1; if we ever see clever evasion (spreading across many installations
// from the same actor) we can layer in repo-level limits.

async function checkRateLimit(installationId: number): Promise<{ allowed: boolean; remaining: number; resetMs: number }> {
  const store = getStore(RATE_STORE);
  const key = String(installationId);
  const now = Date.now();
  let bucket = { count: 0, windowStart: now };
  try {
    const raw = await store.get(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (now - parsed.windowStart < RATE_WINDOW_MS) {
        bucket = parsed;
      }
    }
  } catch {
    /* corrupt blob → reset window */
  }
  if (bucket.count >= RATE_LIMIT_PER_HOUR) {
    return { allowed: false, remaining: 0, resetMs: bucket.windowStart + RATE_WINDOW_MS };
  }
  bucket.count += 1;
  try {
    await store.set(key, JSON.stringify(bucket));
  } catch {
    /* if the store is down, fail open — better to serve than to block */
  }
  return { allowed: true, remaining: RATE_LIMIT_PER_HOUR - bucket.count, resetMs: bucket.windowStart + RATE_WINDOW_MS };
}

// ─── Billing / plan gate ───────────────────────────────────────────────────
//
// GitHub Marketplace delivers a `marketplace_purchase` event whenever a
// customer subscribes, changes, or cancels a plan. We record the most
// recent plan per account login (the org or user that owns the repo)
// into the github-billing store, keyed by lowercased login.
//
// Plan check at command time:
//   - No record  → "free" (safer default; same as if they never bought)
//   - planName matches /^free$/i → "free"
//   - otherwise → "paid"
//
// v1 collapses all paid tiers into one bucket. When we add Pro / Team /
// Enterprise tiers with feature differences, swap getPlan() for a fuller
// shape and check at each gate.

interface BillingRecord {
  accountLogin: string;
  accountId: number;
  planName: string;
  planId: number;
  billingCycle?: string;
  unitCount?: number;
  onFreeTrial?: boolean;
  effectiveDate?: string;
  updatedAt: string;
}

async function getPlan(accountLogin: string | undefined | null): Promise<"free" | "paid"> {
  if (!accountLogin) return "free";
  try {
    const store = getStore(BILLING_STORE);
    const raw = await store.get(accountLogin.toLowerCase());
    if (!raw) return "free";
    const rec: BillingRecord = JSON.parse(raw);
    if (!rec.planName || /^free$/i.test(rec.planName)) return "free";
    return "paid";
  } catch {
    return "free";
  }
}

function upgradeRequiredMessage(verb: string, accountLogin: string | undefined): string {
  const who = accountLogin ? ` on **${accountLogin}**` : "";
  return [
    `🔒 **\`${verb}\` is a paid feature.**`,
    ``,
    `This installation${who} is on the **Free** plan, which covers read + AI-reply commands (\`summarize\`, \`triage\`, \`email\`, \`reply\`, \`handoff\`, \`link\`). State-changing commands (\`close\`, \`merge\`, \`review\`) require a paid plan.`,
    ``,
    `[Upgrade your plan →](https://github.com/marketplace/agenticmail)`,
    ``,
    `— [AgenticMail](https://agenticmail.io) · upgrade-required`,
  ].join("\n");
}

function rateLimitMessage(resetMs: number): string {
  const minutes = Math.max(1, Math.ceil((resetMs - Date.now()) / 60000));
  return [
    `🚦 **Rate limit reached.**`,
    ``,
    `This installation has used its hourly quota of \`@agenticmail\` invocations.`,
    `Try again in **~${minutes} min**.`,
    ``,
    `If this surprises you, check for a comment loop, a workflow that auto-mentions the bot, or open an issue at [agenticmail/github-app](https://github.com/agenticmail/github-app/issues).`,
    ``,
    `— [AgenticMail](https://agenticmail.io) · rate-limit`,
  ].join("\n");
}

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

// Mention parser, free/paid verb sets, and help message all live in
// ./_lib/parse-mention.ts so the unit-test suite can import them without
// pulling in the Anthropic / Octokit / Netlify dependencies. See that
// module for the design notes (first-mention-wins, paid-verb gating, etc).

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
    review: "Write a thoughtful code-review comment for this pull request. Look at the description and any discussion so far. Be specific, constructive, and concrete: mention what looks good, what concerns you, and any risks to merging. Don't say 'looks fine' without evidence. Keep it under 400 words.",
  }[verb] || "Summarize the thread.";

  const msg = await client.messages.create({
    // claude-3-5-haiku-latest is the public-API alias; the OAuth beta
    // surface (anthropic-beta: oauth-2025-04-20) rejects it with a
    // 404 not_found_error because OAuth tokens are bound to the
    // caller's Claude.ai entitlements and only see the 4.x model
    // family. claude-haiku-4-5 is the cheap-and-fast option that
    // both surfaces accept.
    model: "claude-haiku-4-5",
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
  const start = Date.now();
  const installationId = payload?.installation?.id;
  const repo = payload?.repository?.full_name;
  try {
    let handled = true;
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
    } else if (event === "marketplace_purchase") {
      await handleMarketplacePurchase(payload);
    } else {
      handled = false;
    }
    await writeAudit({
      ts: new Date().toISOString(),
      deliveryId,
      event,
      action: payload?.action,
      installationId,
      repo,
      status: handled ? "processed" : "ignored",
      latencyMs: Date.now() - start,
    });
  } catch (err: any) {
    const message = err?.message ?? String(err);
    console.error(`[github-webhook] processing failed for ${event} ${deliveryId}:`, message);
    await writeAudit({
      ts: new Date().toISOString(),
      deliveryId,
      event,
      action: payload?.action,
      installationId,
      repo,
      status: "failed",
      latencyMs: Date.now() - start,
      error: message?.slice(0, 500),
    });
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
  // Rate limit check — runs AFTER we know it's a real mention so noise
  // (non-mention comments) doesn't burn quota. If exceeded, post a
  // polite cooldown reply so the user knows why nothing happened.
  const rate = await checkRateLimit(installationId);
  if (!rate.allowed) {
    await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      headers: { authorization: `token ${token}` },
      owner, repo, issue_number: payload.issue.number,
      body: rateLimitMessage(rate.resetMs),
    }).catch(() => {});
    return;
  }
  // Drop a 👀 reaction so the user sees "got it" immediately.
  await request("POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
    headers: { authorization: `token ${token}` },
    owner, repo, comment_id: payload.comment.id,
    content: "eyes",
  }).catch(() => {});
  const isPR = !!payload.issue.pull_request;
  const issueNumber = payload.issue.number;
  // Unknown verb after the mention → post a usage comment so the user
  // discovers the valid commands instead of silently getting a summary.
  if (cmd.verb === "help") {
    await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      headers: { authorization: `token ${token}` },
      owner, repo, issue_number: issueNumber,
      body: helpMessage(),
    }).catch(() => {});
    return;
  }
  // Plan gate for state-changing verbs. Repo owner login is the
  // Marketplace customer; we look up their plan and reject if they
  // are on Free.
  if (PAID_VERB_SET.has(cmd.verb)) {
    const accountLogin = payload.repository?.owner?.login;
    const plan = await getPlan(accountLogin);
    if (plan !== "paid") {
      await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
        headers: { authorization: `token ${token}` },
        owner, repo, issue_number: issueNumber,
        body: upgradeRequiredMessage(cmd.verb, accountLogin),
      }).catch(() => {});
      return;
    }
    // Paid actions
    if (cmd.verb === "close") {
      await actionClose(token, owner, repo, issueNumber, isPR, cmd.args);
      return;
    }
    if (cmd.verb === "merge") {
      if (!isPR) {
        await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
          headers: { authorization: `token ${token}` },
          owner, repo, issue_number: issueNumber,
          body: `❌ \`merge\` only works on pull requests, not issues.\n\n— [AgenticMail](https://agenticmail.io) · merge`,
        }).catch(() => {});
        return;
      }
      await actionMerge(token, owner, repo, issueNumber, cmd.args);
      return;
    }
    if (cmd.verb === "review") {
      if (!isPR) {
        await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
          headers: { authorization: `token ${token}` },
          owner, repo, issue_number: issueNumber,
          body: `❌ \`review\` only works on pull requests, not issues.\n\n— [AgenticMail](https://agenticmail.io) · review`,
        }).catch(() => {});
        return;
      }
      const comments = await fetchIssueComments(token, owner, repo, issueNumber);
      await actionReview(token, owner, repo, issueNumber, cmd.args, {
        repo: repoFull,
        kind: "pull_request",
        number: issueNumber,
        title: payload.issue.title ?? "",
        body: payload.issue.body ?? "",
        comments,
        triggerUser: payload.comment.user.login,
      });
      return;
    }
  }
  // Free path — LLM-generated comment reply.
  const comments = await fetchIssueComments(token, owner, repo, issueNumber);
  const reply = await generateReply(cmd.verb, cmd.args, {
    repo: repoFull,
    kind: isPR ? "pull_request" : "issue",
    number: issueNumber,
    title: payload.issue.title ?? "",
    body: payload.issue.body ?? "",
    comments,
    triggerUser: payload.comment.user.login,
  });
  await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    headers: { authorization: `token ${token}` },
    owner, repo, issue_number: issueNumber,
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
  const rate = await checkRateLimit(installationId);
  if (!rate.allowed) {
    await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      headers: { authorization: `token ${token}` },
      owner, repo, issue_number: payload.pull_request.number,
      body: rateLimitMessage(rate.resetMs),
    }).catch(() => {});
    return;
  }
  const prNumber = payload.pull_request.number;
  const threadCtx = {
    repo: repoFull,
    kind: "pull_request" as const,
    number: prNumber,
    title: payload.pull_request.title ?? "",
    body: payload.pull_request.body ?? "",
    comments: [{ user: payload.comment.user.login, body: payload.comment.body }],
    triggerUser: payload.comment.user.login,
  };
  if (cmd.verb === "help") {
    await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      headers: { authorization: `token ${token}` },
      owner, repo, issue_number: prNumber,
      body: helpMessage(),
    }).catch(() => {});
    return;
  }
  if (PAID_VERB_SET.has(cmd.verb)) {
    const accountLogin = payload.repository?.owner?.login;
    const plan = await getPlan(accountLogin);
    if (plan !== "paid") {
      await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
        headers: { authorization: `token ${token}` },
        owner, repo, issue_number: prNumber,
        body: upgradeRequiredMessage(cmd.verb, accountLogin),
      }).catch(() => {});
      return;
    }
    if (cmd.verb === "close") {
      await actionClose(token, owner, repo, prNumber, true, cmd.args);
      return;
    }
    if (cmd.verb === "merge") {
      await actionMerge(token, owner, repo, prNumber, cmd.args);
      return;
    }
    if (cmd.verb === "review") {
      await actionReview(token, owner, repo, prNumber, cmd.args, threadCtx);
      return;
    }
  }
  const reply = await generateReply(cmd.verb, cmd.args, threadCtx);
  // Reply on the same conversation, not as a new review thread (simpler v1).
  await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    headers: { authorization: `token ${token}` },
    owner, repo, issue_number: prNumber,
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
  const record = {
    account: payload.installation.account?.login,
    type: payload.installation.account?.type,
    repoSelection: payload.installation.repository_selection,
    repos: (payload.repositories ?? []).map((r: any) => r.full_name),
    // `sender` is the human who clicked install. `email` is only present
    // if their GitHub email is public — for orgs we also try the
    // organization_billing_email field on the installation account.
    installerLogin: payload.sender?.login,
    installerEmail: payload.sender?.email ?? undefined,
    organizationBillingEmail: payload.installation.account?.organization_billing_email ?? undefined,
    installedAt: new Date().toISOString(),
  };
  await store.set(String(payload.installation.id), JSON.stringify(record)).catch(() => {});
  await notifyInstallation("created", payload.installation.id, record);
}

async function handleInstallationDeleted(payload: any): Promise<void> {
  const store = getStore(INSTALL_STORE);
  // Read first so we can include account info in the notification.
  let priorRecord: any = null;
  try {
    const raw = await store.get(String(payload.installation.id));
    if (raw) priorRecord = JSON.parse(raw);
  } catch { /* ignore */ }
  await store.delete(String(payload.installation.id)).catch(() => {});
  await notifyInstallation("deleted", payload.installation.id, priorRecord ?? {
    account: payload.installation.account?.login,
    type: payload.installation.account?.type,
  });
}

// Operator-facing notification on install / uninstall. v1 just writes a
// dedicated audit entry that's easy to grep; v2 will send via AgenticMail
// once we wire the API key into this function's env. The blob entry alone
// is enough to drive a simple "new installs in the last 7 days" digest.
async function notifyInstallation(kind: "created" | "deleted", installationId: number, record: any): Promise<void> {
  const ts = new Date().toISOString();
  await writeAudit({
    ts,
    deliveryId: `install-${kind}-${installationId}-${Date.now()}`,
    event: "installation_notify",
    action: kind,
    installationId,
    status: "processed",
    extra: {
      account: record?.account,
      type: record?.type,
      repoSelection: record?.repoSelection,
      repoCount: Array.isArray(record?.repos) ? record.repos.length : undefined,
    },
  });
  // Outbound email — generic over any provider that accepts POST JSON
  // with a `to`/`subject`/`text` body. The env var AGENTICMAIL_SEND_URL
  // is where we route — could be the AgenticMail SaaS, Resend, Postmark,
  // a self-hosted SMTP relay, etc. If it isn't set, we just skip and the
  // welcome path is a no-op without breaking anything.
  const apiKey = process.env.AGENTICMAIL_API_KEY;
  const opsTo = process.env.AGENTICMAIL_OPS_EMAIL;
  const sendUrl = process.env.AGENTICMAIL_SEND_URL;
  if (!apiKey || !sendUrl) return;
  const ops = {
    to: opsTo,
    subject: kind === "created"
      ? `[github-app] new install: ${record?.account ?? installationId}`
      : `[github-app] uninstall: ${record?.account ?? installationId}`,
    text: [
      `Installation ID: ${installationId}`,
      `Account: ${record?.account ?? "(unknown)"} (${record?.type ?? "?"})`,
      `Repo selection: ${record?.repoSelection ?? "?"}`,
      Array.isArray(record?.repos) ? `Repos (${record.repos.length}): ${record.repos.slice(0, 10).join(", ")}` : "",
      `At: ${ts}`,
    ].filter(Boolean).join("\n"),
  };
  await postEmail(sendUrl, apiKey, ops).catch(() => {});
  // Welcome email to the installer themselves. Only on `created`. The
  // installer's email isn't always exposed by the webhook payload (orgs
  // hide it; users can mark it private), so we send to a synthetic
  // GitHub no-reply address keyed by login + the public account
  // `organization_billing_email` if available. The send-url provider is
  // responsible for refusing if it can't deliver.
  if (kind === "created") {
    const installerEmail = record?.installerEmail
      ?? record?.organizationBillingEmail
      ?? `${record?.account}@users.noreply.github.com`;
    const settingsUrl = record?.type === "Organization"
      ? `https://github.com/organizations/${record.account}/settings/installations/${installationId}`
      : `https://github.com/settings/installations/${installationId}`;
    const repoScope = record?.repoSelection === "all"
      ? "all repositories"
      : `${Array.isArray(record?.repos) ? record.repos.length : 0} selected repositories`;
    const welcome = {
      to: installerEmail,
      subject: "You've installed AgenticMail for GitHub 🎀",
      text: renderWelcomeText({
        accountLogin: record?.account ?? "your account",
        accountType: record?.type ?? "account",
        repoScope,
        settingsUrl,
      }),
    };
    await postEmail(sendUrl, apiKey, welcome).catch(() => {});
  }
}

// Inlined to avoid spinning a separate template file at runtime. Mirrors
// github-app/templates/welcome-email.txt.
function renderWelcomeText(p: { accountLogin: string; accountType: string; repoScope: string; settingsUrl: string }): string {
  return [
    `Hi there,`,
    ``,
    `AgenticMail for GitHub is now installed on ${p.accountLogin} (${p.accountType}), covering ${p.repoScope}. Your AI teammate is live.`,
    ``,
    `TRY IT IN 10 SECONDS`,
    `Open any issue or pull request on a covered repo and leave a comment:`,
    ``,
    `    @agenticmail summarize`,
    ``,
    `The bot will react 👀, then post a 2-paragraph summary of the thread.`,
    ``,
    `WHAT ELSE IT DOES (free)`,
    `  @agenticmail triage             suggest labels + priority`,
    `  @agenticmail reply <prompt>     draft a follow-up comment`,
    `  @agenticmail email <address>    send the thread to a real inbox`,
    `  @agenticmail handoff to <agent> route it to another agent`,
    `  @agenticmail link related       find related issues`,
    ``,
    `PAID ACTIONS (upgrade to enable)`,
    `  @agenticmail close              close the issue or PR`,
    `  @agenticmail merge              merge the PR (default: squash)`,
    `  @agenticmail review             post a formal PR review`,
    ``,
    `New issues are triaged automatically and new pull requests are`,
    `summarized automatically — no mention needed.`,
    ``,
    `MANAGE THIS INSTALL`,
    `Add or remove repositories, or uninstall, from the App settings page:`,
    `${p.settingsUrl}`,
    ``,
    `Questions? Reach us at support@agenticmail.io.`,
    ``,
    `— The AgenticMail team`,
    `https://agenticmail.io`,
  ].join("\n");
}

async function postEmail(url: string, apiKey: string, payload: { to?: string; subject: string; text: string }): Promise<void> {
  if (!payload.to) return;
  await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      // Some providers (Resend, Postmark) use Bearer instead. Send both;
      // unknown headers are ignored.
      "authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
}

// ─── Paid action handlers ──────────────────────────────────────────────────
//
// These three handlers run AFTER the plan gate has passed in
// handleIssueComment / handlePRReviewComment. Each posts a confirmation (or
// failure) comment so the trigger user gets visible feedback even when
// GitHub branch protection / permissions reject the action.

async function actionClose(token: string, owner: string, repo: string, num: number, isPR: boolean, args: string): Promise<void> {
  const reason = /not[\s-]?planned|wontfix|won't[\s-]?fix|duplicate/i.test(args) ? "not_planned" : "completed";
  try {
    // The Issues PATCH endpoint also closes pull requests — the PR-specific
    // endpoint is only required for editing draft/locked state. Using the
    // Issues endpoint keeps the code path uniform.
    await request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
      headers: { authorization: `token ${token}` },
      owner, repo, issue_number: num,
      // state_reason is only valid for issues; GitHub silently ignores it on PRs.
      ...(isPR ? { state: "closed" } : { state: "closed", state_reason: reason }),
    } as any);
    await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      headers: { authorization: `token ${token}` },
      owner, repo, issue_number: num,
      body: `✅ Closed${!isPR ? ` (\`${reason}\`)` : ""}.\n\n— [AgenticMail](https://agenticmail.io) · close`,
    });
  } catch (err: any) {
    const status = err?.status;
    const detail = err?.response?.data?.message ?? err?.message ?? "unknown error";
    await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      headers: { authorization: `token ${token}` },
      owner, repo, issue_number: num,
      body: `❌ Close failed (${status}): ${detail}\n\n— [AgenticMail](https://agenticmail.io) · close`,
    }).catch(() => {});
  }
}

async function actionMerge(token: string, owner: string, repo: string, num: number, args: string): Promise<void> {
  // Default: squash. Most teams prefer it. Override with explicit args.
  let merge_method: "squash" | "merge" | "rebase" = "squash";
  if (/\brebase\b/i.test(args)) merge_method = "rebase";
  else if (/\bmerge[-_ ]commit\b|\btrue[-_ ]?merge\b|\bno[-_ ]squash\b/i.test(args)) merge_method = "merge";
  try {
    await request("PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge", {
      headers: { authorization: `token ${token}` },
      owner, repo, pull_number: num,
      merge_method,
    });
    await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      headers: { authorization: `token ${token}` },
      owner, repo, issue_number: num,
      body: `✅ Merged with \`${merge_method}\`.\n\n— [AgenticMail](https://agenticmail.io) · merge`,
    });
  } catch (err: any) {
    const status = err?.status;
    const detail = err?.response?.data?.message ?? err?.message ?? "unknown error";
    await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      headers: { authorization: `token ${token}` },
      owner, repo, issue_number: num,
      body: `❌ Merge failed (${status}): ${detail}\n\n— [AgenticMail](https://agenticmail.io) · merge`,
    }).catch(() => {});
  }
}

async function actionReview(token: string, owner: string, repo: string, num: number, args: string, threadCtx: any): Promise<void> {
  const reviewBody = await generateReply("review", args, threadCtx);
  try {
    // Always event: "COMMENT" — the bot never auto-APPROVES or REQUEST_CHANGES
    // without explicit human signal. v2 may add `@agenticmail review approve`
    // for users who want it, gated separately.
    await request("POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
      headers: { authorization: `token ${token}` },
      owner, repo, pull_number: num,
      body: reviewBody,
      event: "COMMENT",
    });
  } catch (err: any) {
    const status = err?.status;
    const detail = err?.response?.data?.message ?? err?.message ?? "unknown error";
    await request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      headers: { authorization: `token ${token}` },
      owner, repo, issue_number: num,
      body: `❌ Review post failed (${status}): ${detail}\n\n— [AgenticMail](https://agenticmail.io) · review`,
    }).catch(() => {});
  }
}

// ─── Marketplace purchase handler ──────────────────────────────────────────

async function handleMarketplacePurchase(payload: any): Promise<void> {
  const action = payload.action; // purchased | changed | pending_change | cancelled
  const purchase = payload.marketplace_purchase;
  if (!purchase?.account?.login) return;
  const store = getStore(BILLING_STORE);
  const key = purchase.account.login.toLowerCase();
  if (action === "cancelled") {
    await store.delete(key).catch(() => {});
  } else {
    const record: BillingRecord = {
      accountLogin: purchase.account.login,
      accountId: purchase.account.id,
      planName: purchase.plan?.name ?? "Unknown",
      planId: purchase.plan?.id ?? 0,
      billingCycle: purchase.billing_cycle,
      unitCount: purchase.unit_count,
      onFreeTrial: purchase.on_free_trial,
      effectiveDate: payload.effective_date,
      updatedAt: new Date().toISOString(),
    };
    await store.set(key, JSON.stringify(record)).catch(() => {});
  }
  await writeAudit({
    ts: new Date().toISOString(),
    deliveryId: `mp-${action}-${purchase.account.login}-${Date.now()}`,
    event: "marketplace_purchase",
    action,
    status: "processed",
    extra: {
      account: purchase.account.login,
      planName: purchase.plan?.name,
      billingCycle: purchase.billing_cycle,
      onFreeTrial: purchase.on_free_trial,
    },
  });
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
  const event = req.headers.get("x-github-event") ?? "";
  const deliveryId = req.headers.get("x-github-delivery") ?? "";
  const verified = await verifySignature(rawBody, sig, secret);
  if (!verified) {
    await writeAudit({
      ts: new Date().toISOString(),
      deliveryId,
      event,
      status: "bad_signature",
    });
    return new Response(JSON.stringify({ error: "bad signature" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  // Delivery dedup. GitHub retries — same delivery UUID arrives 2-3×.
  if (deliveryId) {
    const dedup = getStore(DEDUP_STORE);
    const seen = await dedup.get(deliveryId).catch(() => null);
    if (seen) {
      await writeAudit({
        ts: new Date().toISOString(),
        deliveryId,
        event,
        status: "deduped",
      });
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
