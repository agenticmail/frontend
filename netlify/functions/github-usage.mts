import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

/**
 * Per-installation usage + cost aggregator. Reads the github-usage blob
 * store written by generateReply() in github-webhook.mts and rolls up
 * tokens and cost per account per day.
 *
 *   GET /api/github/usage
 *       → total across all accounts for today (`?day=YYYY-MM-DD` to pick a day)
 *
 *   GET /api/github/usage?account=<login>
 *       → roll up for one account for `?day=` (default today)
 *
 *   GET /api/github/usage?account=<login>&range=30
 *       → 30-day rolling sum for one account
 *
 * Auth: x-admin-token header matching env ADMIN_AUDIT_TOKEN. Same gate as
 * /api/github/audit and /api/github/billing.
 *
 * Why this matters: Anthropic charges per token, customers pay flat rate.
 * Without this you have no way to know if a "Pro at $19/mo" account is
 * generating $2/mo or $200/mo in compute cost. The numbers here are what
 * makes pricing decisions defensible instead of vibes.
 */

const USAGE_STORE = "github-usage";

interface UsageEntry {
  ts: string;
  account: string;
  installationId?: number;
  deliveryId?: string;
  verb: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costCents: number;
}

interface Rollup {
  account?: string;
  days: number;
  calls: number;
  inputTokens: number;
  outputTokens: number;
  costCents: number;
  byVerb: Record<string, { calls: number; inputTokens: number; outputTokens: number; costCents: number }>;
}

export default async function handler(req: Request, _ctx: Context): Promise<Response> {
  const expected = process.env.ADMIN_AUDIT_TOKEN;
  if (!expected) return json({ error: "endpoint disabled (set ADMIN_AUDIT_TOKEN env to enable)" }, 503);
  if (req.headers.get("x-admin-token") !== expected) return json({ error: "unauthorized" }, 401);

  const url = new URL(req.url);
  const account = url.searchParams.get("account")?.toLowerCase();
  const day = url.searchParams.get("day") ?? new Date().toISOString().slice(0, 10);
  const range = Math.min(parseInt(url.searchParams.get("range") ?? "1", 10) || 1, 90);

  const store = getStore(USAGE_STORE);

  // Build the list of day strings to scan.
  const days = rangeDays(day, range);

  // Collect all entries across requested days, optionally filtered to one
  // account. Each day-and-account combination has its own key prefix so
  // listing is bounded and fast.
  const entries: UsageEntry[] = [];
  for (const d of days) {
    const prefix = account ? `${d}/${account}/` : `${d}/`;
    try {
      const listing = await store.list({ prefix });
      for (const b of listing.blobs ?? []) {
        const raw = await store.get(b.key);
        if (!raw) continue;
        try {
          entries.push(JSON.parse(raw));
        } catch {
          /* skip malformed */
        }
      }
    } catch (err: any) {
      return json({ error: "list failed", detail: err?.message ?? String(err), day: d }, 500);
    }
  }

  const rollup = aggregate(entries);
  rollup.account = account;
  rollup.days = days.length;

  return json({
    ok: true,
    day: range === 1 ? day : undefined,
    range,
    days,
    account,
    rollup,
    costUSD: roundUSD(rollup.costCents / 100),
    byVerbUSD: Object.fromEntries(Object.entries(rollup.byVerb).map(
      ([v, r]) => [v, { ...r, costUSD: roundUSD(r.costCents / 100) }],
    )),
    sample: entries.slice(0, 5),
  }, 200);
}

function aggregate(entries: UsageEntry[]): Rollup {
  const out: Rollup = {
    days: 0,
    calls: entries.length,
    inputTokens: 0,
    outputTokens: 0,
    costCents: 0,
    byVerb: {},
  };
  for (const e of entries) {
    out.inputTokens += e.inputTokens ?? 0;
    out.outputTokens += e.outputTokens ?? 0;
    out.costCents += e.costCents ?? 0;
    const v = e.verb || "unknown";
    if (!out.byVerb[v]) out.byVerb[v] = { calls: 0, inputTokens: 0, outputTokens: 0, costCents: 0 };
    out.byVerb[v].calls += 1;
    out.byVerb[v].inputTokens += e.inputTokens ?? 0;
    out.byVerb[v].outputTokens += e.outputTokens ?? 0;
    out.byVerb[v].costCents += e.costCents ?? 0;
  }
  out.costCents = Math.round(out.costCents * 10_000) / 10_000;
  return out;
}

function rangeDays(endDay: string, n: number): string[] {
  const end = new Date(endDay + "T00:00:00Z");
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function roundUSD(usd: number): number {
  return Math.round(usd * 10_000) / 10_000;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const config = {
  path: "/api/github/usage",
};
