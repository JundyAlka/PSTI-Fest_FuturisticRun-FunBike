import { NextRequest } from "next/server";

/**
 * In-memory token-bucket rate limiter.
 * Keyed by `${bucket}:${clientIP}`.
 * Automatically cleaned up on process restart (serverless-safe).
 */

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const store = new Map<string, Bucket>();

/** Cleanup old entries periodically */
const CLEANUP_INTERVAL = 5 * 60_000; // 5 min
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store) {
      if (now - bucket.lastRefill > 10 * 60_000) store.delete(key);
    }
  }, CLEANUP_INTERVAL);
  // Prevent timer from keeping process alive
  if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref();
  }
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export interface RateLimitResult {
  allowed: boolean;
  headers: Record<string, string>;
}

/**
 * Check rate limit for a given request.
 * @param req - The incoming Next.js request
 * @param bucket - A named bucket (e.g. "register", "quota")
 * @param maxTokens - Maximum requests per window
 * @param windowMs - Window size in milliseconds
 */
export function checkRateLimit(
  req: NextRequest,
  bucket: string,
  maxTokens: number,
  windowMs: number
): RateLimitResult {
  startCleanup();
  const ip = getClientIP(req);
  const key = `${bucket}:${ip}`;
  const now = Date.now();

  let entry = store.get(key);
  if (!entry) {
    entry = { tokens: maxTokens, lastRefill: now };
    store.set(key, entry);
  }

  // Refill tokens based on elapsed time
  const elapsed = now - entry.lastRefill;
  const refill = Math.floor((elapsed / windowMs) * maxTokens);
  if (refill > 0) {
    entry.tokens = Math.min(maxTokens, entry.tokens + refill);
    entry.lastRefill = now;
  }

  const remaining = Math.max(0, entry.tokens - 1);
  const resetMs = Math.max(0, windowMs - (now - entry.lastRefill));

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(maxTokens),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil((now + resetMs) / 1000)),
  };

  if (entry.tokens <= 0) {
    headers["Retry-After"] = String(Math.ceil(resetMs / 1000));
    return { allowed: false, headers };
  }

  entry.tokens--;
  return { allowed: true, headers };
}

/**
 * Simple middleware-style rate limit for GET endpoints.
 * Returns null if allowed, or a 429 Response if not.
 */
export function rateLimitOr429(
  req: NextRequest,
  bucket: string,
  maxTokens: number,
  windowMs: number
): { allowed: true } | { allowed: false; response: Response } {
  const result = checkRateLimit(req, bucket, maxTokens, windowMs);
  if (result.allowed) return { allowed: true };

  return {
    allowed: false,
    response: new Response(
      JSON.stringify({ error: "Too many requests. Please wait." }),
      { status: 429, headers: { "Content-Type": "application/json", ...result.headers } }
    ),
  };
}
