import type { EventLocation } from "@/content/events";

export function resolveEventLocation(fallback: EventLocation, settings: Record<string, string>): EventLocation {
  const lat = settings.location_lat?.trim() ? Number(settings.location_lat) : Number.NaN;
  const lng = settings.location_lng?.trim() ? Number(settings.location_lng) : Number.NaN;
  const hasCoordinateOverride = Number.isFinite(lat) && lat >= -90 && lat <= 90 && Number.isFinite(lng) && lng >= -180 && lng <= 180;

  if (!hasCoordinateOverride) return fallback;
  return {
    lat,
    lng,
    label: settings.event_location?.trim() || fallback.label,
    plusCode: settings.location_plus_code?.trim() || fallback.plusCode,
  };
}
