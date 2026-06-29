export type EventDateSlug = "futuristic-run" | "fun-bike";

/** Fallback tunggal ketika event_settings tidak dapat dibaca. */
export const DEFAULT_EVENT_DATES: Record<EventDateSlug, string> = {
  "futuristic-run": "2026-08-01T18:00:00+07:00",
  "fun-bike": "2026-08-02T05:00:00+07:00",
};

const WIB_ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+07:00$/;

export function normalizeEventDate(value: string | null | undefined): string | null {
  const candidate = value?.trim();
  if (!candidate || !WIB_ISO_PATTERN.test(candidate)) return null;
  return Number.isFinite(Date.parse(candidate)) ? candidate : null;
}

export function resolveEventDate(slug: EventDateSlug, value: string | null | undefined): string {
  return normalizeEventDate(value) ?? DEFAULT_EVENT_DATES[slug];
}

export function formatTanggalID(date: Date | string): string {
  const parsed = date instanceof Date ? date : new Date(date);
  if (!Number.isFinite(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(parsed);
}

export function formatEventDate(eventDate: string | null | undefined): string | null {
  const normalized = normalizeEventDate(eventDate);
  return normalized ? formatTanggalID(normalized) : null;
}

export function formatWibTime(eventDate: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Jakarta",
  }).format(new Date(eventDate)).replace(":", ".");
}

export function eventDateOnly(eventDate: string): string {
  return eventDate.slice(0, 10);
}
