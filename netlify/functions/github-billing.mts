import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

/**
 * Operator-only billing record manager for the github-webhook function.
 *
 *   GET    /api/github/billing?account=<login>
 *   POST   /api/github/billing  body: { account, planName, ... }
 *   DELETE /api/github/billing?account=<login>
 *
 * Auth: header `x-admin-token` matching env `ADMIN_AUDIT_TOKEN`.
 *
 * Use cases:
 *   - Comp an account onto a paid plan without a real Marketplace purchase
 *     (free-trial extensions, friendly accounts, internal testing).
 *   - Inspect what plan we have on file for a given account.
 *   - Manually clear a stale record after a billing mistake.
 *
 * In normal operation, the github-billing store is populated automatically
 * by the marketplace_purchase webhook handler. This endpoint is an escape
 * hatch, not the primary write path.
 */

const BILLING_STORE = "github-billing";

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

export default async function handler(req: Request, _ctx: Context): Promise<Response> {
  const expected = process.env.ADMIN_AUDIT_TOKEN;
  if (!expected) return json({ error: "endpoint disabled (set ADMIN_AUDIT_TOKEN env to enable)" }, 503);
  if (req.headers.get("x-admin-token") !== expected) return json({ error: "unauthorized" }, 401);

  const url = new URL(req.url);
  const store = getStore(BILLING_STORE);

  if (req.method === "GET") {
    const account = url.searchParams.get("account");
    if (!account) {
      // List all records.
      try {
        const listing = await store.list();
        const records = await Promise.all((listing.blobs ?? []).map(async b => {
          const raw = await store.get(b.key);
          return raw ? { key: b.key, ...JSON.parse(raw) } : null;
        }));
        return json({ ok: true, count: records.length, records: records.filter(Boolean) }, 200);
      } catch (err: any) {
        return json({ error: "list failed", detail: err?.message ?? String(err) }, 500);
      }
    }
    const raw = await store.get(account.toLowerCase());
    if (!raw) return json({ ok: true, account, record: null, plan: "free" }, 200);
    const rec = JSON.parse(raw) as BillingRecord;
    const plan = !rec.planName || /^free$/i.test(rec.planName) ? "free" : "paid";
    return json({ ok: true, account, record: rec, plan }, 200);
  }

  if (req.method === "POST") {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return json({ error: "malformed json body" }, 400);
    }
    const accountLogin = body.account ?? body.accountLogin;
    const planName = body.planName ?? body.plan;
    if (!accountLogin || !planName) {
      return json({ error: "account and planName are required" }, 400);
    }
    const record: BillingRecord = {
      accountLogin,
      accountId: body.accountId ?? 0,
      planName,
      planId: body.planId ?? 0,
      billingCycle: body.billingCycle,
      unitCount: body.unitCount,
      onFreeTrial: !!body.onFreeTrial,
      effectiveDate: body.effectiveDate,
      updatedAt: new Date().toISOString(),
    };
    await store.set(accountLogin.toLowerCase(), JSON.stringify(record));
    const plan = /^free$/i.test(planName) ? "free" : "paid";
    return json({ ok: true, account: accountLogin, plan, record }, 200);
  }

  if (req.method === "DELETE") {
    const account = url.searchParams.get("account");
    if (!account) return json({ error: "account query param required" }, 400);
    await store.delete(account.toLowerCase());
    return json({ ok: true, account, deleted: true }, 200);
  }

  return json({ error: "method not allowed" }, 405);
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const config = {
  path: "/api/github/billing",
};
