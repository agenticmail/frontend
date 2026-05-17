import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

/**
 * Operator-only audit log reader for the github-webhook function.
 *
 *   GET /api/github/audit?day=YYYY-MM-DD&limit=50
 *
 * Auth: requires header `x-admin-token` matching env `ADMIN_AUDIT_TOKEN`.
 * Without that env set, the endpoint is disabled and returns 503.
 *
 * The webhook writes one JSON blob per delivery under key
 *   <YYYY-MM-DD>/<delivery-uuid>
 * so we list a day's prefix, fetch each, and return the most recent entries.
 */

const AUDIT_STORE = "github-webhook-audit";
const INSTALL_STORE = "github-installations";

export default async function handler(req: Request, _ctx: Context): Promise<Response> {
  const expected = process.env.ADMIN_AUDIT_TOKEN;
  if (!expected) {
    return json({ error: "audit endpoint disabled (set ADMIN_AUDIT_TOKEN env to enable)" }, 503);
  }
  const provided = req.headers.get("x-admin-token");
  if (provided !== expected) {
    return json({ error: "unauthorized" }, 401);
  }
  const url = new URL(req.url);
  const day = url.searchParams.get("day") ?? new Date().toISOString().slice(0, 10);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "100", 10) || 100, 500);
  const includeInstalls = url.searchParams.get("installs") === "1";

  const audit = getStore(AUDIT_STORE);
  let entries: any[] = [];
  try {
    // listStore() returns blob keys. We listed by prefix to narrow to a day.
    const listing = await audit.list({ prefix: `${day}/` });
    const keys = (listing.blobs ?? []).map(b => b.key);
    const limited = keys.slice(-limit); // most recent fall last alphabetically (UUID suffix)
    entries = await Promise.all(limited.map(async (key) => {
      try {
        const raw = await audit.get(key);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }));
    entries = entries.filter(Boolean);
  } catch (err: any) {
    return json({ error: "list failed", detail: err?.message ?? String(err) }, 500);
  }

  let installs: any[] | undefined;
  if (includeInstalls) {
    try {
      const ins = getStore(INSTALL_STORE);
      const listing = await ins.list();
      installs = await Promise.all((listing.blobs ?? []).map(async b => {
        const raw = await ins.get(b.key);
        return raw ? { id: b.key, ...JSON.parse(raw) } : null;
      }));
      installs = installs.filter(Boolean) as any[];
    } catch {
      installs = [];
    }
  }

  return json({
    ok: true,
    day,
    count: entries.length,
    entries,
    installs,
  }, 200);
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const config = {
  path: "/api/github/audit",
};
