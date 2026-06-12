import { createClient } from "@insforge/sdk";

const insforgeUrl = process.env.INSFORGE_URL!;
const insforgeServerKey = process.env.INSFORGE_API_KEY ?? process.env.API_KEY;
const insforgeKey = insforgeServerKey ?? process.env.INSFORGE_ANON_KEY;

if (!insforgeUrl || !insforgeKey) {
  throw new Error("Missing INSFORGE_URL and InsForge server key environment variables");
}

if (!insforgeServerKey && process.env.VERCEL_ENV === "production") {
  throw new Error("Missing INSFORGE_API_KEY in production deployment");
}

export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeServerKey ? undefined : insforgeKey,
  headers: insforgeServerKey ? { "x-api-key": insforgeServerKey } : undefined,
});
