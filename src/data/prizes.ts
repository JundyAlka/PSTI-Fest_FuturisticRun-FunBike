export type PrizeValue = number | string | null;

export type PrizeCategory = {
  kategori: string;
  juara1: PrizeValue;
  juara2: PrizeValue;
  juara3: PrizeValue;
  harapan: PrizeValue;
};

export const PRIZES: PrizeCategory[] = [
  { kategori: "Umum Putra", juara1: 500_000, juara2: 400_000, juara3: 200_000, harapan: "Piagam" },
  { kategori: "Umum Putri", juara1: 500_000, juara2: 400_000, juara3: 200_000, harapan: "Piagam" },
  { kategori: "SMP Putra", juara1: 500_000, juara2: 300_000, juara3: 200_000, harapan: "Piagam" },
  { kategori: "SMP Putri", juara1: 500_000, juara2: 300_000, juara3: 200_000, harapan: "Piagam" },
  { kategori: "SD Putra", juara1: null, juara2: null, juara3: null, harapan: null },
  { kategori: "SD Putri", juara1: null, juara2: null, juara3: null, harapan: null },
];

export const PRIZE_FIELDS = ["juara1", "juara2", "juara3", "harapan"] as const;
export type PrizeField = (typeof PRIZE_FIELDS)[number];

export const PRIZE_SETTING_KEYS = [
  "prize_umum_putra_juara1", "prize_umum_putra_juara2", "prize_umum_putra_juara3", "prize_umum_putra_harapan",
  "prize_umum_putri_juara1", "prize_umum_putri_juara2", "prize_umum_putri_juara3", "prize_umum_putri_harapan",
  "prize_smp_putra_juara1", "prize_smp_putra_juara2", "prize_smp_putra_juara3", "prize_smp_putra_harapan",
  "prize_smp_putri_juara1", "prize_smp_putri_juara2", "prize_smp_putri_juara3", "prize_smp_putri_harapan",
  "prize_sd_putra_juara1", "prize_sd_putra_juara2", "prize_sd_putra_juara3", "prize_sd_putra_harapan",
  "prize_sd_putri_juara1", "prize_sd_putri_juara2", "prize_sd_putri_juara3", "prize_sd_putri_harapan",
] as const;

function categorySlug(kategori: string) {
  return kategori.toLowerCase().replace(/\s+/g, "_");
}

export function prizeSettingKey(kategori: string, field: PrizeField) {
  return `prize_${categorySlug(kategori)}_${field}`;
}

export const DEFAULT_PRIZE_SETTINGS: Record<string, string> = Object.fromEntries(
  PRIZES.flatMap((prize) => PRIZE_FIELDS.map((field) => [
    prizeSettingKey(prize.kategori, field),
    prize[field] === null ? "" : String(prize[field]),
  ])),
);

export function resolvedPrizeValue(prize: PrizeCategory, field: PrizeField, settings: Record<string, string>): PrizeValue {
  const configured = settings[prizeSettingKey(prize.kategori, field)]?.trim();
  if (!configured) return prize[field];
  return /^\d+$/.test(configured) ? Number(configured) : configured;
}

export function formatPrizeValue(value: PrizeValue): string {
  if (typeof value === "number") {
    return `Rp${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value)}`;
  }
  return value ?? "Diumumkan saat technical meeting";
}
