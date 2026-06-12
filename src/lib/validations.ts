import { z } from "zod";

export const Step1Schema = z.object({
  fullName: z.string().min(3, "Minimal 3 karakter"),
  nik: z.string().optional().default(""),
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
  bibName: z.string().min(1).max(12, "Maks 12 karakter"),
  emergencyContactName: z.string().min(2, "Wajib diisi"),
  emergencyContactPhone: z.string().min(8, "Wajib diisi"),
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

export type Step1Data = z.infer<typeof Step1Schema>;
export type Step2Data = z.infer<typeof Step2Schema>;
export type PaymentData = z.infer<typeof PaymentSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
