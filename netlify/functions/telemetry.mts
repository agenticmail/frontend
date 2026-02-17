import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";

const STORE_NAME = "telemetry";
const STATS_KEY = "stats";
const DAILY_KEY_PREFIX = "daily:";

interface Stats {
  totalCalls: number;
  totalInstalls: number;
  toolCounts: Record<string, number>;
  installIds: string[]; // last N install IDs for unique count (hashed)
  lastUpdated: string;
}

interface DailyStats {
  calls: number;
  tools: Record<string, number>;
  uniqueInstalls: string[];
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// Simple hash for anonymity — we never store the raw install ID
function hashId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export default async function handler(req: Request, context: Context) {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-cache",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const store = getStore(STORE_NAME);

  // GET — return current stats
  if (req.method === "GET") {
    try {
      const statsStr = await store.get(STATS_KEY);
      if (!statsStr) {
        return Response.json({
          totalCalls: 0,
          totalInstalls: 0,
          topTools: [],
          npmDownloads: 0,
        }, { headers: corsHeaders });
      }

      const stats: Stats = JSON.parse(statsStr);

      // Get npm download count (cached — refreshed by the POST handler)
      let npmDownloads = 0;
      try {
        const npmStr = await store.get("npm-downloads");
        if (npmStr) npmDownloads = JSON.parse(npmStr).total || 0;
      } catch { /* ignore */ }

      // Top 10 tools
      const topTools = Object.entries(stats.toolCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tool, count]) => ({ tool, count }));

      return Response.json({
        totalCalls: stats.totalCalls,
        totalInstalls: stats.totalInstalls,
        topTools,
        npmDownloads,
        lastUpdated: stats.lastUpdated,
      }, { headers: corsHeaders });
    } catch (err) {
      return Response.json({ error: "Failed to read stats" }, {
        status: 500,
        headers: corsHeaders,
      });
    }
  }

  // POST — record telemetry event
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { id, v, p, tools, n } = body;

      if (!id || !tools || typeof tools !== "object") {
        return Response.json({ ok: true }, { headers: corsHeaders }); // silently accept bad data
      }

      const hashedId = hashId(id);
      const callCount = typeof n === "number" ? n : Object.values(tools as Record<string, number>).reduce((a: number, b) => a + (b as number), 0);

      // Load or create stats
      let stats: Stats;
      try {
        const existing = await store.get(STATS_KEY);
        stats = existing ? JSON.parse(existing) : {
          totalCalls: 0,
          totalInstalls: 0,
          toolCounts: {},
          installIds: [],
          lastUpdated: new Date().toISOString(),
        };
      } catch {
        stats = {
          totalCalls: 0,
          totalInstalls: 0,
          toolCounts: {},
          installIds: [],
          lastUpdated: new Date().toISOString(),
        };
      }

      // Update totals
      stats.totalCalls += callCount;

      // Track unique installs (keep last 10K hashed IDs)
      if (!stats.installIds.includes(hashedId)) {
        stats.installIds.push(hashedId);
        stats.totalInstalls++;
        // Trim to last 10K
        if (stats.installIds.length > 10000) {
          stats.installIds = stats.installIds.slice(-10000);
        }
      }

      // Update tool counts
      for (const [tool, count] of Object.entries(tools as Record<string, number>)) {
        stats.toolCounts[tool] = (stats.toolCounts[tool] || 0) + (count as number);
      }

      stats.lastUpdated = new Date().toISOString();

      // Save stats
      await store.set(STATS_KEY, JSON.stringify(stats));

      // Also save daily stats
      const day = today();
      const dailyKey = DAILY_KEY_PREFIX + day;
      let daily: DailyStats;
      try {
        const existing = await store.get(dailyKey);
        daily = existing ? JSON.parse(existing) : { calls: 0, tools: {}, uniqueInstalls: [] };
      } catch {
        daily = { calls: 0, tools: {}, uniqueInstalls: [] };
      }

      daily.calls += callCount;
      for (const [tool, count] of Object.entries(tools as Record<string, number>)) {
        daily.tools[tool] = (daily.tools[tool] || 0) + (count as number);
      }
      if (!daily.uniqueInstalls.includes(hashedId)) {
        daily.uniqueInstalls.push(hashedId);
      }
      await store.set(dailyKey, JSON.stringify(daily));

      // Periodically refresh npm download count (every ~100 requests)
      if (stats.totalCalls % 100 < callCount) {
        try {
          const npmRes = await fetch("https://api.npmjs.org/downloads/point/last-month/agenticmail", {
            signal: AbortSignal.timeout(3000),
          });
          if (npmRes.ok) {
            const npmData = await npmRes.json() as any;
            await store.set("npm-downloads", JSON.stringify({
              total: npmData.downloads || 0,
              updated: new Date().toISOString(),
            }));
          }
        } catch { /* best effort */ }
      }

      return Response.json({ ok: true }, { headers: corsHeaders });
    } catch {
      // Always return 200 — never block the client
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
  }

  return Response.json({ error: "Method not allowed" }, {
    status: 405,
    headers: corsHeaders,
  });
}

export const config = {
  path: "/api/telemetry",
};
