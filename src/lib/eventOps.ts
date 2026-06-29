import { insforge } from "@/lib/insforge";
import type { EventSlug } from "@/content/events";
import { normalizeEventDate } from "@/lib/eventDate";

export type PublicEventOps = {
  slug: EventSlug;
  eventDate: string | null;
  location: string | null;
  deadline: string | null;
  price: number | null;
  quota: number | null;
  categoryCode: string | null;
  categoryLabel: string | null;
  contactPerson: string | null;
  qrisImageUrl: string | null;
  bankName: string | null;
  bankAccount: string | null;
  settings: Record<string, string>;
};

function settingValue(settings: Array<{ key: string; value: string }> | null | undefined, key: string) {
  return settings?.find((item) => item.key === key)?.value?.trim() || null;
}

function emptyOps(slug: EventSlug): PublicEventOps {
  return {
    slug,
    eventDate: null,
    location: null,
    deadline: null,
    price: null,
    quota: null,
    categoryCode: null,
    categoryLabel: null,
    contactPerson: null,
    qrisImageUrl: null,
    bankName: null,
    bankAccount: null,
    settings: {},
  };
}

export async function getPublicEventOps(slug: EventSlug): Promise<PublicEventOps> {
  try {
    const [eventResult, categoryResult, settingsResult] = await Promise.all([
      insforge.database
        .from("events")
        .select("location, deadline")
        .eq("slug", slug)
        .maybeSingle(),
      insforge.database
        .from("event_categories")
        .select("code, label, price, quota")
        .eq("event_type", slug)
        .order("id", { ascending: true }),
      insforge.database
        .from("event_settings")
        .select("key, value")
        .eq("event_type", slug),
    ]);

    const settings = settingsResult.data as Array<{ key: string; value: string }> | null;
    const settingMap = Object.fromEntries((settings ?? []).map((item) => [item.key, item.value]));
    const event = eventResult.data as { location?: string | null; deadline?: string | null } | null;
    const categories = categoryResult.data as Array<{ code: string; label: string; price: number; quota: number }> | null;
    const primaryCategory = categories?.[0] ?? null;
    const registrationFee = Number(settingValue(settings, "registration_fee"));

    return {
      slug,
      eventDate: normalizeEventDate(settingValue(settings, "event_date")),
      location: settingValue(settings, "event_location") ?? event?.location ?? null,
      deadline: settingValue(settings, "registration_deadline") ?? event?.deadline ?? null,
      price: Number.isFinite(registrationFee) && registrationFee > 0 ? registrationFee : primaryCategory?.price ?? null,
      quota: primaryCategory?.quota ?? null,
      categoryCode: primaryCategory?.code ?? null,
      categoryLabel: primaryCategory?.label ?? null,
      contactPerson: settingValue(settings, "contact_person"),
      qrisImageUrl: settingValue(settings, "payment_qris_image_url"),
      bankName: settingValue(settings, "payment_bank_name"),
      bankAccount: settingValue(settings, "payment_bank_account"),
      settings: settingMap,
    };
  } catch (error) {
    console.error(`[eventOps] Failed to load public event data for ${slug}`, error);
    return emptyOps(slug);
  }
}

export async function getPublicEventsOps(slugs: EventSlug[]) {
  const entries = await Promise.all(slugs.map(async (slug) => [slug, await getPublicEventOps(slug)] as const));
  return Object.fromEntries(entries) as Record<EventSlug, PublicEventOps>;
}
