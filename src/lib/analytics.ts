/**
 * Lightweight analytics module for conversion funnel tracking.
 * Events are tracked per event_type and sent to the analytics API.
 * Falls back silently if tracking fails (never blocks user flow).
 */

export type AnalyticsEvent =
  | "landing_view"
  | "cta_click"
  | "form_start"
  | "form_step_complete"
  | "form_submit"
  | "payment_proof_upload"
  | "payment_verified";

interface TrackPayload {
  event: AnalyticsEvent;
  eventType: string; // "futuristic-run" | "fun-bike"
  meta?: Record<string, string | number | boolean>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

/** Track an analytics event — fire-and-forget, never throws */
export function track(payload: TrackPayload): void {
  try {
    // In development, just log
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", payload.event, payload.eventType, payload.meta ?? "");
      return;
    }

    // Fire-and-forget beacon
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(
        `${SITE_URL}/api/analytics`,
        JSON.stringify({
          ...payload,
          ts: Date.now(),
          url: typeof window !== "undefined" ? window.location.href : "",
          ref: typeof document !== "undefined" ? document.referrer : "",
        })
      );
    } else {
      // Fallback: fetch with keepalive
      void fetch(`${SITE_URL}/api/analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          ts: Date.now(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }),
        keepalive: true,
      });
    }
  } catch {
    // Silently ignore — analytics should never break user flow
  }
}

/** Convenience: track landing page view */
export function trackLandingView(eventType: string): void {
  track({ event: "landing_view", eventType });
}

/** Convenience: track CTA click */
export function trackCtaClick(eventType: string, destination: string): void {
  track({ event: "cta_click", eventType, meta: { destination } });
}

/** Convenience: track form start */
export function trackFormStart(eventType: string): void {
  track({ event: "form_start", eventType });
}

/** Convenience: track form step completion */
export function trackFormStep(eventType: string, step: number): void {
  track({ event: "form_step_complete", eventType, meta: { step } });
}

/** Convenience: track form submission */
export function trackFormSubmit(eventType: string, regNumber: string): void {
  track({ event: "form_submit", eventType, meta: { regNumber } });
}

/** Convenience: track payment proof upload */
export function trackPaymentProof(eventType: string, regNumber: string): void {
  track({ event: "payment_proof_upload", eventType, meta: { regNumber } });
}

/** Convenience: track payment verified (admin action) */
export function trackPaymentVerified(eventType: string, regNumber: string): void {
  track({ event: "payment_verified", eventType, meta: { regNumber } });
}
