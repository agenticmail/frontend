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
  // The Anthropic auth slot accepts EITHER an OAuth token
  // (sk-ant-oat01-…) via ANTHROPIC_AUTH_TOKEN OR a classic API key
  // (sk-ant-api03-…) via ANTHROPIC_API_KEY. We treat the LLM slot as
  // "configured" if either is present.
  const env = {
    GITHUB_APP_ID: !!process.env.GITHUB_APP_ID,
    GITHUB_APP_PRIVATE_KEY: !!process.env.GITHUB_APP_PRIVATE_KEY,
    GITHUB_WEBHOOK_SECRET: !!process.env.GITHUB_WEBHOOK_SECRET,
    ANTHROPIC_AUTH_TOKEN: !!process.env.ANTHROPIC_AUTH_TOKEN,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
  };
  const allConfigured = env.GITHUB_APP_ID
    && env.GITHUB_APP_PRIVATE_KEY
    && env.GITHUB_WEBHOOK_SECRET
    && (env.ANTHROPIC_AUTH_TOKEN || env.ANTHROPIC_API_KEY);
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
