import { insforge } from "./insforge";

// ── Fallback defaults for 'futuristic-run' ──────────────────────────────────
export const CATEGORY_PRICES: Record<string, number> = {
  "5K": 120000,
};

export const CATEGORY_QUOTAS: Record<string, number> = {
  "5K": 200,
};

export const CATEGORY_LABELS: Record<string, string> = {
  "5K": "Run 5K",
  funbike: "Futuristic Bike Ride",
};

// ── Event category helpers (DB-driven) ──────────────────────────────────────
export type EventCategoryRow = {
  code: string;
  label: string;
  price: number;
  quota: number;
  min_age: number | null;
};

export type EventInfoRow = {
  slug: string;
  name: string;
  theme: string | null;
  is_open: boolean;
  event_date: string | null;
  location: string | null;
  deadline: string | null;
};

/** Fetch categories for a given event type from InsForge */
export async function getEventCategories(eventType: string): Promise<EventCategoryRow[]> {
  const { data, error } = await insforge.database
    .from("event_categories")
    .select("code, label, price, quota, min_age")
    .eq("event_type", eventType)
    .order("id", { ascending: true });

  if (error || !data || data.length === 0) {
    // Fallback for futuristic-run when DB is unreachable
    if (eventType === "futuristic-run") {
      return [{ code: "5K", label: "Run 5K", price: 120000, quota: 200, min_age: 13 }];
    }
    return [];
  }
  return data as EventCategoryRow[];
}

/** Fetch event info from InsForge */
export async function getEventInfo(eventType: string): Promise<EventInfoRow | null> {
  const { data, error } = await insforge.database
    .from("events")
    .select("slug, name, theme, is_open, event_date, location, deadline")
    .eq("slug", eventType)
    .maybeSingle();

  if (error || !data) return null;
  return data as EventInfoRow;
}

// ── Registration number generator ───────────────────────────────────────────
const REG_PREFIXES: Record<string, string> = {
  "futuristic-run": "FR2026",
  "fun-bike": "FB2026",
};

/** Generate an event-aware registration number */
export function generateRegistrationNumber(eventType: string, id: number): string {
  const prefix = REG_PREFIXES[eventType] ?? eventType.toUpperCase().replace(/-/g, "").slice(0, 4);
  return `${prefix}-${String(id).padStart(4, "0")}`;
}

/** Backward-compatible alias for futuristic-run */
export function generateRegNumber(id: number): string {
  return generateRegistrationNumber("futuristic-run", id);
}

// ── Utility functions ───────────────────────────────────────────────────────
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getPaymentStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Menunggu Verifikasi",
    verified: "Terverifikasi",
    rejected: "Ditolak",
  };
  return map[status] ?? status;
}

export function getPaymentStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: "#FF8C00",
    verified: "#00E5FF",
    rejected: "#FF006E",
  };
  return map[status] ?? "#B0C4DE";
}

export function generateBibNumber(id: number): number {
  return 1000 + id;
}
