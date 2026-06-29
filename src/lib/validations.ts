import { z } from "zod";

export const Step1Schema = z.object({
  fullName: z.string().min(3, "Minimal 3 karakter"),
  nik: z.string().regex(/^\d{16}$/, "NIK harus 16 digit angka").optional().or(z.literal("")),
  gender: z.enum(["male", "female"], { message: "Pilih jenis kelamin" }),
  birthPlace: z.string().min(2, "Wajib diisi"),
  birthDate: z.string().min(1, "Wajib diisi"),
  phone: z.string().regex(/^08\d{8,11}$/, "Format: 08xxxxxxxxxx"),
  email: z.string().email("Format email tidak valid"),
  address: z.string().min(5, "Wajib diisi"),
  city: z.string().min(2, "Wajib diisi"),
  province: z.string().min(2, "Pilih provinsi"),
});

export const Step2Schema = z.object({
  eventType: z.string().min(1, "Event tidak valid").optional().default("futuristic-run"),
  category: z.string().min(1, "Kategori tidak valid"),
  jerseySize: z.enum(["XS", "S", "M", "L", "XL", "XXL", "XXXL"], { message: "Pilih ukuran" }),
  bibName: z.string().max(12, "Maks 12 karakter").optional().default(""),
  bikeType: z.string().optional(),
  emergencyContactName: z.string().min(2, "Wajib diisi"),
  emergencyContactPhone: z.string().regex(/^08\d{8,11}$/, "Format HP darurat: 08xxxxxxxxxx"),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], { message: "Pilih golongan darah" }),
  medicalHistory: z.string().optional(),
  runningClub: z.string().optional(),
});

export const PaymentSchema = z.object({
  paymentMethod: z.enum(["transfer", "qris"], { message: "Pilih metode pembayaran" }),
  agreeTerms: z.literal(true, { message: "Wajib disetujui" }),
  agreeHealth: z.literal(true, { message: "Wajib disetujui" }),
});

export const RegisterSchema = Step1Schema.merge(Step2Schema).merge(
  z.object({
    paymentMethod: z.enum(["transfer", "qris"]),
    paymentProof: z.string().optional(),
  })
);

export const VerifyPaymentSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(["verified", "rejected"]),
  notes: z.string().optional(),
  bibNumber: z.number().int().optional(),
});

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Whitelist of allowed setting keys for admin POST
export const ALLOWED_SETTING_KEYS = [
  "registration_open",
  "quota_5k",
  "quota_funbike",
  "event_date",
  "event_location",
  "early_bird_deadline",
  "registration_deadline",
  "payment_bank_name",
  "payment_bank_account",
  "payment_bank_holder",
  "payment_qris_nmid",
  "payment_qris_image_url",
  "payment_qris_image_key",
  "registration_fee",
  "payment_transfer_enabled",
  "payment_qris_enabled",
  "contact_person",
  "benefit_prize_details",
  "benefit_race_pack_contents",
  "location_lat",
  "location_lng",
  "location_plus_code",
  "prize_umum_1",
  "prize_umum_2",
  "prize_umum_3",
  "prize_pelajar_1",
  "prize_pelajar_2",
  "prize_pelajar_3",
] as const;

export const AdminSettingsSchema = z.object({
  settings: z.record(
    z.enum(ALLOWED_SETTING_KEYS),
    z.string().max(500)
  ),
  eventType: z.string().optional().default("futuristic-run"),
});

// Payment proof upload validation
export const PAYMENT_PROOF_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const PAYMENT_PROOF_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export type Step1Data = z.infer<typeof Step1Schema>;
export type Step2Data = z.infer<typeof Step2Schema>;
export type PaymentData = z.infer<typeof PaymentSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
