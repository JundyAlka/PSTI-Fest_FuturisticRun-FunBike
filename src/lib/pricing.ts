export type PricingTier = {
  id: string;
  label: string;
  price: number;
  quota: number;
  order: number;
  active: boolean;
};

export type PricingSnapshot = {
  currentTier: PricingTier | null;
  currentPrice: number | null;
  presaleRemaining: number;
  presaleQuota: number;
  normalPrice: number | null;
  registeredCount: number;
  tiers: PricingTier[];
};

export function formatPricingCurrency(amount: number | null | undefined) {
  if (!amount || amount <= 0) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function normalizePricingEvent(value: string | null) {
  if (value === "run" || value === "futuristic-run") return "futuristic-run";
  if (value === "bike" || value === "fun-bike") return "fun-bike";
  return null;
}
