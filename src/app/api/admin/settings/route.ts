import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { insforge } from "@/lib/insforge";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const eventType = req.nextUrl.searchParams.get("eventType") ?? "futuristic-run";

  const { data: settings, error } = await insforge.database
    .from("event_settings")
    .select("key, value")
    .eq("event_type", eventType);

  if (error) return NextResponse.json({ error: "Server error" }, { status: 500 });

  const map = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]));
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const eventType = req.nextUrl.searchParams.get("eventType") ?? "futuristic-run";
  const body: Record<string, string> = await req.json();

  const updates = await Promise.all(
    Object.entries(body).map(async ([key, value]) => {
      // Upsert: try update first, insert if not exists
      const { data: existing } = await insforge.database
        .from("event_settings")
        .select("id")
        .eq("event_type", eventType)
        .eq("key", key)
        .maybeSingle();

      if (existing) {
        return insforge.database
          .from("event_settings")
          .update({ value })
          .eq("id", existing.id);
      } else {
        return insforge.database
          .from("event_settings")
          .insert([{ event_type: eventType, key, value }]);
      }
    })
  );

  return NextResponse.json({ success: true, updated: updates.length });
}
