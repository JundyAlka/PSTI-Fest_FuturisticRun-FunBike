import { NextResponse } from "next/server";
import { checkInsforgeHealth } from "@/lib/insforgeHealth";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  const insforge = await checkInsforgeHealth(5_000);
  const body = {
    status: insforge.ok ? "ok" : "degraded",
    services: {
      insforge: {
        ok: insforge.ok,
        latencyMs: Date.now() - startedAt,
      },
    },
    checkedAt: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    status: insforge.ok ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
