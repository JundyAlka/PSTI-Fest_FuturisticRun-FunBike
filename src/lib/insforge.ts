"use server";
import { createClient } from "@insforge/sdk";

function getInsforgeClient() {
  const insforgeUrl = process.env.INSFORGE_URL;
  const insforgeServerKey = process.env.INSFORGE_API_KEY ?? process.env.API_KEY;
  const insforgeKey = insforgeServerKey ?? process.env.INSFORGE_ANON_KEY;

  if (!insforgeUrl || !insforgeKey) {
    throw new Error("Missing INSFORGE_URL and InsForge server key environment variables");
  }

  if (!insforgeServerKey && process.env.VERCEL_ENV === "production") {
    throw new Error("Missing INSFORGE_API_KEY in production deployment");
  }

  return createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeServerKey ? undefined : insforgeKey,
    headers: insforgeServerKey ? { "x-api-key": insforgeServerKey } : undefined,
  });
}

// Singleton — created lazily at first use (safe for next build)
let _client: ReturnType<typeof createClient> | null = null;

export function getInsforge() {
  if (!_client) {
    _client = getInsforgeClient();
  }
  return _client;
}

/** @deprecated Use getInsforge() instead — kept for backward compat */
export const insforge = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return (getInsforge() as Record<string | symbol, unknown>)[prop];
  },
});
