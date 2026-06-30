import { insforge } from "../src/lib/insforge";
import { EVENTS } from "../src/content/events";

async function main() {
  console.log("🔄 Syncing updated FAQ & Rules content to Database Dashboard (event_settings)...");

  const eventTypes: Array<"futuristic-run" | "fun-bike"> = ["futuristic-run", "fun-bike"];

  for (const eventType of eventTypes) {
    const event = EVENTS[eventType];
    
    // Sync FAQ
    const faqString = event.faq.map((item) => `${item.q} | ${item.a}`).join("\n");
    console.log(`[${eventType}] Syncing FAQ (${event.faq.length} items)...`);
    const faqRes = await insforge.database
      .from("event_settings")
      .upsert({
        event_type: eventType,
        key: "faq",
        value: faqString,
        updated_at: new Date().toISOString(),
      }, { onConflict: "event_type,key" });

    if (faqRes.error) {
      console.error(`❌ Error syncing FAQ for ${eventType}:`, faqRes.error);
    } else {
      console.log(`✅ FAQ synced for ${eventType}`);
    }

    // Sync Rules
    const rulesString = event.rules.join("\n");
    console.log(`[${eventType}] Syncing Rules (${event.rules.length} items)...`);
    const rulesRes = await insforge.database
      .from("event_settings")
      .upsert({
        event_type: eventType,
        key: "rules",
        value: rulesString,
        updated_at: new Date().toISOString(),
      }, { onConflict: "event_type,key" });

    if (rulesRes.error) {
      console.error(`❌ Error syncing Rules for ${eventType}:`, rulesRes.error);
    } else {
      console.log(`✅ Rules synced for ${eventType}`);
    }
  }

  console.log("🏁 Sync completed successfully!");
}

main().catch((err) => {
  console.error("Fatal error during sync:", err);
  process.exit(1);
});
