import type { Context } from "@netlify/functions";

export default async function handler(req: Request, context: Context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=3600", // cache for 1 hour
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Fetch from npm API
    const [weekRes, monthRes, totalRes] = await Promise.all([
      fetch("https://api.npmjs.org/downloads/point/last-week/agenticmail", { signal: AbortSignal.timeout(5000) }),
      fetch("https://api.npmjs.org/downloads/point/last-month/agenticmail", { signal: AbortSignal.timeout(5000) }),
      fetch("https://api.npmjs.org/downloads/point/2026-01-01:2099-12-31/agenticmail", { signal: AbortSignal.timeout(5000) }),
    ]);

    const week = weekRes.ok ? (await weekRes.json() as any).downloads : 0;
    const month = monthRes.ok ? (await monthRes.json() as any).downloads : 0;
    const total = totalRes.ok ? (await totalRes.json() as any).downloads : 0;

    return Response.json({
      downloads: { week, month, total },
      package: "agenticmail",
      updated: new Date().toISOString(),
    }, { headers: corsHeaders });
  } catch {
    return Response.json({
      downloads: { week: 0, month: 0, total: 0 },
      package: "agenticmail",
      error: "Failed to fetch npm stats",
    }, { status: 502, headers: corsHeaders });
  }
}

export const config = {
  path: "/api/npm-stats",
};
