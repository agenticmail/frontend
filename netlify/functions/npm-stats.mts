import type { Context } from "@netlify/functions";

// Both packages we promote on the marketing site. Order matters — the
// frontend lays out the cards in this order (OSS first, enterprise
// second) so they read as "start here → scale up here".
const PACKAGES = [
  "agenticmail",            // OSS — email/SMS for AI agents (CLI, MCP, OpenClaw plugin)
  "@agenticmail/enterprise", // Enterprise — full multi-tenant workforce platform
] as const;

interface PackageStats {
  pkg: string;
  week: number;
  month: number;
  total: number;
}

async function fetchPackageStats(pkg: string): Promise<PackageStats> {
  // npm download endpoint accepts scoped packages with the @ encoded inline.
  const enc = encodeURIComponent(pkg);
  const [weekRes, monthRes, totalRes] = await Promise.all([
    fetch(`https://api.npmjs.org/downloads/point/last-week/${enc}`, { signal: AbortSignal.timeout(5000) }),
    fetch(`https://api.npmjs.org/downloads/point/last-month/${enc}`, { signal: AbortSignal.timeout(5000) }),
    fetch(`https://api.npmjs.org/downloads/point/2026-01-01:2099-12-31/${enc}`, { signal: AbortSignal.timeout(5000) }),
  ]);
  return {
    pkg,
    week: weekRes.ok ? ((await weekRes.json() as any).downloads ?? 0) : 0,
    month: monthRes.ok ? ((await monthRes.json() as any).downloads ?? 0) : 0,
    total: totalRes.ok ? ((await totalRes.json() as any).downloads ?? 0) : 0,
  };
}

export default async function handler(req: Request, _context: Context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=3600", // 1-hour edge cache
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const results = await Promise.all(PACKAGES.map(fetchPackageStats));

    // Combined totals so the existing LiveStats counter (which expects
    // `downloads.total`) keeps working without a client-side change.
    // The new `packages` array carries the per-package breakdown for
    // the product-lineup cards.
    const combined = {
      week: results.reduce((s, r) => s + r.week, 0),
      month: results.reduce((s, r) => s + r.month, 0),
      total: results.reduce((s, r) => s + r.total, 0),
    };

    return Response.json({
      downloads: combined,           // backwards compat — combined totals
      packages: results,             // per-package detail
      updated: new Date().toISOString(),
    }, { headers: corsHeaders });
  } catch {
    return Response.json({
      downloads: { week: 0, month: 0, total: 0 },
      packages: [],
      error: "Failed to fetch npm stats",
    }, { status: 502, headers: corsHeaders });
  }
}

export const config = {
  path: "/api/npm-stats",
};
