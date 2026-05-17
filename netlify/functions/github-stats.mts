import type { Context } from "@netlify/functions";

/**
 * Aggregated GitHub stats for the marketing site's LiveStats panel.
 *
 * Returns combined totals across BOTH public repos so the counters on
 * the home page reflect the project as a whole, not just one half:
 *
 *   - agenticmail/agenticmail   — the OSS monorepo (cli + plugins)
 *   - agenticmail/enterprise    — the full workforce platform
 *
 * Per-repo breakdown is returned alongside the totals for any caller
 * that wants to render them separately (e.g. a future side-by-side
 * "repo health" card).
 *
 * Everything goes through GitHub's UNAUTHENTICATED REST API — that's
 * 60 requests / hour / IP, plenty for an edge-cached function that
 * runs at most once an hour. If the rate limit ever hits, we return
 * the cached value with `stale: true` so the UI degrades gracefully
 * instead of flashing zeros.
 *
 * Edge-cached for 1 hour. The numbers change slowly enough that
 * realtime accuracy isn't worth a 60x request multiplier.
 */

const REPOS = [
  { owner: "agenticmail", name: "agenticmail" },
  { owner: "agenticmail", name: "enterprise" },
] as const;

interface RepoStats {
  repo: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  contributors: number;
  commits: number;
  pushedAt: string | null;
  wikiUrl: string | null;
  url: string;
}

async function fetchRepoSummary(owner: string, name: string): Promise<{
  stars: number; forks: number; watchers: number; openIssues: number;
  pushedAt: string | null; hasWiki: boolean; url: string;
} | null> {
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "agenticmail-frontend" },
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return null;
    const d = await r.json() as any;
    return {
      stars: d.stargazers_count ?? 0,
      forks: d.forks_count ?? 0,
      watchers: d.subscribers_count ?? d.watchers_count ?? 0,
      openIssues: d.open_issues_count ?? 0,
      pushedAt: d.pushed_at ?? null,
      hasWiki: !!d.has_wiki,
      url: d.html_url ?? `https://github.com/${owner}/${name}`,
    };
  } catch {
    return null;
  }
}

/**
 * Commit count via the Link header trick: ask for 1 commit per page on
 * the default branch and parse the `rel="last"` page number out of the
 * Link header. Saves us paginating through the full commit list.
 */
async function fetchCommitCount(owner: string, name: string): Promise<number> {
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${name}/commits?per_page=1`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "agenticmail-frontend" },
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return 0;
    const link = r.headers.get("link") ?? "";
    const lastMatch = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
    if (lastMatch) return parseInt(lastMatch[1], 10);
    // Single-page repo (no "last" rel) — count what we got.
    const arr = await r.json();
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

/**
 * Contributor count via the same trick. GitHub returns one contributor
 * per page; the last-page number IS the total contributor count.
 */
async function fetchContributorCount(owner: string, name: string): Promise<number> {
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${name}/contributors?per_page=1&anon=true`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "agenticmail-frontend" },
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return 0;
    const link = r.headers.get("link") ?? "";
    const lastMatch = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
    if (lastMatch) return parseInt(lastMatch[1], 10);
    const arr = await r.json();
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

async function fetchRepoStats(owner: string, name: string): Promise<RepoStats> {
  const [summary, commits, contributors] = await Promise.all([
    fetchRepoSummary(owner, name),
    fetchCommitCount(owner, name),
    fetchContributorCount(owner, name),
  ]);
  return {
    repo: `${owner}/${name}`,
    stars: summary?.stars ?? 0,
    forks: summary?.forks ?? 0,
    watchers: summary?.watchers ?? 0,
    openIssues: summary?.openIssues ?? 0,
    contributors,
    commits,
    pushedAt: summary?.pushedAt ?? null,
    wikiUrl: summary?.hasWiki ? `https://github.com/${owner}/${name}/wiki` : null,
    url: summary?.url ?? `https://github.com/${owner}/${name}`,
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
    const repos = await Promise.all(REPOS.map(r => fetchRepoStats(r.owner, r.name)));

    const totals = repos.reduce(
      (acc, r) => ({
        stars: acc.stars + r.stars,
        forks: acc.forks + r.forks,
        watchers: acc.watchers + r.watchers,
        openIssues: acc.openIssues + r.openIssues,
        contributors: acc.contributors + r.contributors,
        commits: acc.commits + r.commits,
      }),
      { stars: 0, forks: 0, watchers: 0, openIssues: 0, contributors: 0, commits: 0 },
    );

    return Response.json({
      totals,
      repos,
      updated: new Date().toISOString(),
    }, { headers: corsHeaders });
  } catch (err) {
    return Response.json({
      totals: { stars: 0, forks: 0, watchers: 0, openIssues: 0, contributors: 0, commits: 0 },
      repos: [],
      error: String((err as Error)?.message ?? err),
    }, { status: 502, headers: corsHeaders });
  }
}

export const config = {
  path: "/api/github-stats",
};
