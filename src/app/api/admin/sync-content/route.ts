import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { insforge } from "@/lib/insforge";
import { EVENTS } from "@/content/events";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const eventTypes: Array<"futuristic-run" | "fun-bike"> = ["futuristic-run", "fun-bike"];
  const results: Record<string, unknown> = {};

  for (const eventType of eventTypes) {
    const event = EVENTS[eventType];
    const faqString = event.faq.map((item) => `${item.q} | ${item.a}`).join("\n");
    const rulesString = event.rules.join("\n");

    const [faqRes, rulesRes] = await Promise.all([
      insforge.database.rpc("save_event_settings_atomic_v1", {
        p_event_type: eventType,
        p_settings: { faq: faqString, rules: rulesString },
      }),
      insforge.database.from("event_settings").upsert({
        event_type: eventType,
        key: "rules",
        value: rulesString,
        updated_at: new Date().toISOString(),
      }, { onConflict: "event_type,key" }),
    ]);

    results[eventType] = {
      rpcResult: faqRes.error ? { error: faqRes.error } : { success: true },
      upsertResult: rulesRes.error ? { error: rulesRes.error } : { success: true },
    };
  }

  return NextResponse.json({ success: true, results });
}
