export function normalizeEventDate(value: string | null | undefined): string | null {
  const candidate = value?.trim();
  if (!candidate || !/^\d{4}-\d{2}-\d{2}$/.test(candidate)) return null;

  const [year, month, day] = candidate.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) return null;

  return candidate;
}

export function eventStartIso(eventDate: string | null | undefined, startTime: string): string | null {
  const normalized = normalizeEventDate(eventDate);
  return normalized ? `${normalized}T${startTime}:00+07:00` : null;
}

export function formatEventDate(eventDate: string | null | undefined): string | null {
  const normalized = normalizeEventDate(eventDate);
  if (!normalized) return null;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${normalized}T00:00:00+07:00`));
}
