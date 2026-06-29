import { createClient } from "@insforge/sdk";

type InsforgeClient = ReturnType<typeof createClient>;

let _client: InsforgeClient | null = null;

function buildClient(): InsforgeClient {
  const insforgeUrl = process.env.INSFORGE_URL;
  const insforgeServerKey = process.env.INSFORGE_API_KEY ?? process.env.API_KEY;
  const insforgeKey = insforgeServerKey ?? process.env.INSFORGE_ANON_KEY;

  if (!insforgeUrl || !insforgeKey) {
    throw new Error(
      "Missing INSFORGE_URL and InsForge key env variables. " +
        "Set INSFORGE_URL and INSFORGE_API_KEY in your environment."
    );
  }

  return createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeServerKey ? undefined : insforgeKey,
    headers: insforgeServerKey ? { "x-api-key": insforgeServerKey } : undefined,
  });
}

/** Returns the InsForge client singleton. Safe to call at request time; throws if env vars are missing. */
export function getInsforge(): InsforgeClient {
  if (!_client) _client = buildClient();
  return _client;
}

/**
 * Direct access shorthand — identical to getInsforge().
 * Kept for backward compatibility with existing call-sites.
 * The client is initialised lazily so module-level import is safe during next build.
 */
export const insforge: InsforgeClient = new Proxy({} as InsforgeClient, {
  get(_t, prop: string | symbol) {
    const client = getInsforge();
    const val = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(client) : val;
  },
});

