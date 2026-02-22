import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";

const STORE_NAME = "registry";

interface DomainRecord {
  domain: string;
  keyHash: string;
  dnsChallenge: string;
  registrationId: string;
  orgName: string | null;
  contactEmail: string | null;
  status: "pending_dns" | "verified";
  verifiedAt: string | null;
  registeredAt: string;
  lastVerifyAttempt: string | null;
  verifyAttempts: number;
}

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function uuid(): string {
  return crypto.randomUUID();
}

// ─── DNS TXT Verification via DNS-over-HTTPS ──────────

async function verifyDnsTxt(
  domain: string,
  expectedChallenge: string
): Promise<boolean> {
  const hostname = `_agenticmail-verify.${domain}`;
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=TXT`,
      {
        headers: { Accept: "application/dns-json" },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return false;
    const data = (await res.json()) as any;
    if (!data.Answer) return false;
    for (const answer of data.Answer) {
      // TXT records come quoted: "am-verify=..."
      const value = String(answer.data || "").replace(/^"|"$/g, "");
      if (value === expectedChallenge) return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ─── bcrypt-like comparison using Web Crypto ──────────
// We store keyHash as SHA-256 hex (not bcrypt) for edge compatibility

async function hashKey(key: string): Promise<string> {
  const encoded = new TextEncoder().encode(key);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

async function compareKey(plaintext: string, hash: string): Promise<boolean> {
  const computed = await hashKey(plaintext);
  return computed === hash;
}

// ─── Rate Limiting (simple per-IP via Blobs) ──────────

async function checkRateLimit(ip: string): Promise<boolean> {
  const store = getStore(STORE_NAME);
  const key = `ratelimit:${ip}`;
  try {
    const raw = await store.get(key);
    if (raw) {
      const data = JSON.parse(raw) as { count: number; windowStart: number };
      const elapsed = Date.now() - data.windowStart;
      if (elapsed < 60_000) {
        if (data.count >= 20) return false;
        data.count++;
        await store.set(key, JSON.stringify(data));
        return true;
      }
    }
    // New window
    await store.set(key, JSON.stringify({ count: 1, windowStart: Date.now() }));
    return true;
  } catch {
    return true; // Allow on error
  }
}

// ─── Domain CRUD via Blobs ────────────────────────────

async function getDomain(domain: string): Promise<DomainRecord | null> {
  const store = getStore(STORE_NAME);
  try {
    const raw = await store.get(`domain:${domain}`);
    if (!raw) return null;
    return JSON.parse(raw) as DomainRecord;
  } catch {
    return null;
  }
}

async function saveDomain(record: DomainRecord): Promise<void> {
  const store = getStore(STORE_NAME);
  await store.set(`domain:${record.domain}`, JSON.stringify(record));
}

// ─── JSON helpers ─────────────────────────────────────

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// ─── Main Handler ─────────────────────────────────────

export default async function handler(
  req: Request,
  context: Context
): Promise<Response> {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/enterprise/, "");

  // Rate limit
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    context.ip ||
    "unknown";
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return json({ error: "Rate limit exceeded. Try again later." }, 429);
  }

  // ─── Health ────────────────────────────────────

  if (path === "/health" || path === "") {
    return json({
      status: "ok",
      service: "agenticmail-registry",
      backend: "netlify-blobs",
    });
  }

  // ─── Register Domain ──────────────────────────

  if (path === "/v1/domains/register" && req.method === "POST") {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    if (!body?.domain || !body?.keyHash) {
      return json(
        { error: "Missing required fields: domain, keyHash" },
        400
      );
    }

    const domain = String(body.domain).toLowerCase().trim();
    if (!/^[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
      return json({ error: "Invalid domain format" }, 400);
    }

    const existing = await getDomain(domain);

    if (existing?.status === "verified") {
      return json(
        {
          error:
            "Domain is already registered and verified. Use the /recover endpoint if this is your domain.",
        },
        409
      );
    }

    const dnsChallenge = `am-verify=${randomHex(24)}`;
    const registrationId = uuid();

    const record: DomainRecord = {
      domain,
      keyHash: body.sha256Hash || body.keyHash,
      dnsChallenge,
      registrationId,
      orgName: body.orgName || null,
      contactEmail: body.contactEmail || null,
      status: "pending_dns",
      verifiedAt: null,
      registeredAt: new Date().toISOString(),
      lastVerifyAttempt: null,
      verifyAttempts: 0,
    };

    await saveDomain(record);

    return json({ registrationId, dnsChallenge }, 201);
  }

  // ─── Verify DNS ───────────────────────────────

  if (path === "/v1/domains/verify" && req.method === "POST") {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    if (!body?.domain) {
      return json({ error: "Missing required field: domain" }, 400);
    }

    const domain = String(body.domain).toLowerCase().trim();
    const record = await getDomain(domain);

    if (!record) {
      return json({ error: "Domain is not registered" }, 404);
    }

    if (record.status === "verified") {
      return json({ verified: true, verifiedAt: record.verifiedAt });
    }

    // Update attempt tracking
    record.lastVerifyAttempt = new Date().toISOString();
    record.verifyAttempts++;

    const verified = await verifyDnsTxt(domain, record.dnsChallenge);

    if (verified) {
      record.status = "verified";
      record.verifiedAt = new Date().toISOString();
      await saveDomain(record);
      return json({ verified: true });
    }

    await saveDomain(record);

    return json({
      verified: false,
      error: `DNS TXT record not found. Add: _agenticmail-verify.${domain} TXT "${record.dnsChallenge}"`,
      attempts: record.verifyAttempts,
    });
  }

  // ─── Recover Domain ───────────────────────────

  if (path === "/v1/domains/recover" && req.method === "POST") {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    if (!body?.domain || !body?.deploymentKey) {
      return json(
        { error: "Missing required fields: domain, deploymentKey" },
        400
      );
    }

    const domain = String(body.domain).toLowerCase().trim();
    const record = await getDomain(domain);

    if (!record) {
      return json({ error: "Domain is not registered" }, 404);
    }

    // Verify deployment key against stored SHA-256 hash
    const match = await compareKey(body.deploymentKey, record.keyHash);
    if (!match) return json({ error: "Invalid deployment key" }, 403);

    const newChallenge = `am-verify=${randomHex(24)}`;
    const newRegId = uuid();

    record.dnsChallenge = newChallenge;
    record.registrationId = newRegId;
    record.status = "pending_dns";
    record.verifiedAt = null;
    record.verifyAttempts = 0;

    await saveDomain(record);

    return json({
      success: true,
      registrationId: newRegId,
      dnsChallenge: newChallenge,
    });
  }

  // ─── Delete Domain Registration ────────────────

  if (path === "/v1/domains/delete" && req.method === "POST") {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    if (!body?.domain || !body?.deploymentKey) {
      return json(
        { error: "Missing required fields: domain, deploymentKey" },
        400
      );
    }

    const domain = String(body.domain).toLowerCase().trim();
    const record = await getDomain(domain);

    if (!record) {
      return json({ error: "Domain is not registered" }, 404);
    }

    const match = await compareKey(body.deploymentKey, record.keyHash);
    if (!match) return json({ error: "Invalid deployment key" }, 403);

    const store = getStore(STORE_NAME);
    await store.delete(`domain:${domain}`);

    return json({ success: true, deleted: domain });
  }

  // ─── Domain Status (public) ───────────────────

  if (path.match(/^\/v1\/domains\/[^/]+\/status$/) && req.method === "GET") {
    const domain = path.split("/")[3].toLowerCase().trim();
    const record = await getDomain(domain);

    if (!record) {
      return json({ registered: false, verified: false });
    }

    return json({
      registered: true,
      verified: record.status === "verified",
    });
  }

  return json({ error: "Not found" }, 404);
}

export const config = {
  path: "/enterprise/*",
};
