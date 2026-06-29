import { describe, it, expect } from "vitest";
import {
  Step1Schema,
  Step2Schema,
  PaymentSchema,
  VerifyPaymentSchema,
  ALLOWED_SETTING_KEYS,
  PAYMENT_PROOF_MAX_SIZE,
  PAYMENT_PROOF_TYPES,
} from "@/lib/validations";

describe("Step1Schema", () => {
  it("accepts valid data", () => {
    const result = Step1Schema.safeParse({
      fullName: "Budi Santoso",
      nik: "1234567890123456",
      gender: "male",
      birthPlace: "Jakarta",
      birthDate: "1995-01-15",
      phone: "08123456789",
      email: "budi@test.com",
      address: "Jl. Merdeka No. 1",
      city: "Jakarta",
      province: "DKI Jakarta",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short fullName", () => {
    const result = Step1Schema.safeParse({
      fullName: "Bu",
      gender: "male",
      birthPlace: "Jakarta",
      birthDate: "1995-01-15",
      phone: "08123456789",
      email: "budi@test.com",
      address: "Jl. Merdeka No. 1",
      city: "Jakarta",
      province: "DKI Jakarta",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid NIK (not 16 digits)", () => {
    const result = Step1Schema.safeParse({
      fullName: "Budi Santoso",
      nik: "12345",
      gender: "male",
      birthPlace: "Jakarta",
      birthDate: "1995-01-15",
      phone: "08123456789",
      email: "budi@test.com",
      address: "Jl. Merdeka No. 1",
      city: "Jakarta",
      province: "DKI Jakarta",
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty NIK", () => {
    const result = Step1Schema.safeParse({
      fullName: "Budi Santoso",
      nik: "",
      gender: "male",
      birthPlace: "Jakarta",
      birthDate: "1995-01-15",
      phone: "08123456789",
      email: "budi@test.com",
      address: "Jl. Merdeka No. 1",
      city: "Jakarta",
      province: "DKI Jakarta",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid phone format", () => {
    const result = Step1Schema.safeParse({
      fullName: "Budi Santoso",
      gender: "male",
      birthPlace: "Jakarta",
      birthDate: "1995-01-15",
      phone: "+62812345678",
      email: "budi@test.com",
      address: "Jl. Merdeka No. 1",
      city: "Jakarta",
      province: "DKI Jakarta",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = Step1Schema.safeParse({
      fullName: "Budi Santoso",
      gender: "male",
      birthPlace: "Jakarta",
      birthDate: "1995-01-15",
      phone: "08123456789",
      email: "not-an-email",
      address: "Jl. Merdeka No. 1",
      city: "Jakarta",
      province: "DKI Jakarta",
    });
    expect(result.success).toBe(false);
  });
});

describe("Step2Schema", () => {
  it("accepts valid data", () => {
    const result = Step2Schema.safeParse({
      category: "5K",
      jerseySize: "M",
      bibName: "BUDI",
      emergencyContactName: "Ani",
      emergencyContactPhone: "08123456789",
      bloodType: "O+",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid jersey size", () => {
    const result = Step2Schema.safeParse({
      category: "5K",
      jerseySize: "XXXXL",
      emergencyContactName: "Ani",
      emergencyContactPhone: "08123456789",
      bloodType: "O+",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid emergency phone", () => {
    const result = Step2Schema.safeParse({
      category: "5K",
      jerseySize: "M",
      emergencyContactName: "Ani",
      emergencyContactPhone: "12345",
      bloodType: "O+",
    });
    expect(result.success).toBe(false);
  });
});

describe("PaymentSchema", () => {
  it("accepts valid payment", () => {
    const result = PaymentSchema.safeParse({
      paymentMethod: "transfer",
      agreeTerms: true,
      agreeHealth: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects unchecked terms", () => {
    const result = PaymentSchema.safeParse({
      paymentMethod: "transfer",
      agreeTerms: false,
      agreeHealth: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("VerifyPaymentSchema", () => {
  it("accepts valid verification", () => {
    const result = VerifyPaymentSchema.safeParse({
      id: 1,
      status: "verified",
    });
    expect(result.success).toBe(true);
  });

  it("accepts rejection with notes", () => {
    const result = VerifyPaymentSchema.safeParse({
      id: 1,
      status: "rejected",
      notes: "Bukti tidak jelas",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = VerifyPaymentSchema.safeParse({
      id: 1,
      status: "pending",
    });
    expect(result.success).toBe(false);
  });
});

describe("AdminSettingsSchema", () => {
  it("has correct whitelist keys", () => {
    expect(ALLOWED_SETTING_KEYS).toContain("registration_open");
    expect(ALLOWED_SETTING_KEYS).toContain("payment_qris_image_url");
    expect(ALLOWED_SETTING_KEYS).toContain("registration_fee");
  });
});

describe("Payment proof constants", () => {
  it("has 5MB max size", () => {
    expect(PAYMENT_PROOF_MAX_SIZE).toBe(5 * 1024 * 1024);
  });

  it("supports JPG, PNG, WebP, PDF", () => {
    expect(PAYMENT_PROOF_TYPES).toContain("image/jpeg");
    expect(PAYMENT_PROOF_TYPES).toContain("image/png");
    expect(PAYMENT_PROOF_TYPES).toContain("image/webp");
    expect(PAYMENT_PROOF_TYPES).toContain("application/pdf");
  });
});
