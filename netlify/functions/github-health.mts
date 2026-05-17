import type { Context } from "@netlify/functions";

/**
 * Health probe for the GitHub webhook function. Lets us verify the
 * endpoint is reachable + the env vars are configured BEFORE we register
 * the App. Returns 200 with which secrets are present (not their values).
 *
 * Set the webhook URL on the App to
 *   https://agenticmail.io/api/github/webhook
 * and check this endpoint at
 *   https://agenticmail.io/api/github/health
 */

export default async function handler(_req: Request, _ctx: Context): Promise<Response> {
  const env = {
    GITHUB_APP_ID: !!process.env.GITHUB_APP_ID,
    GITHUB_APP_PRIVATE_KEY: !!process.env.GITHUB_APP_PRIVATE_KEY,
    GITHUB_WEBHOOK_SECRET: !!process.env.GITHUB_WEBHOOK_SECRET,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
  };
  const allConfigured = Object.values(env).every(Boolean);
  return new Response(JSON.stringify({
    ok: true,
    subsystem: "github-webhook",
    configured: allConfigured,
    secrets: env,
    timestamp: new Date().toISOString(),
  }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export const config = {
  path: "/api/github/health",
};
