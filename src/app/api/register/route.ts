import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { RegisterSchema } from "@/lib/validations";
import { sendRegistrationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";
import { checkInsforgeHealth, serviceUnavailable } from "@/lib/insforgeHealth";
import { randomBytes } from "node:crypto";
import { hashRegistrationAccessToken } from "@/lib/registrationAccess";

type AtomicRegistrationResult = {
  reg_number: string;
  id: number;
  price: number;
  pricing_tier_id: string;
};

const ATOMIC_ERRORS = {
  REG_QUOTA_FULL: { status: 409, code: "QUOTA_FULL", message: "Kuota kategori sudah penuh" },
  REG_DUPLICATE: { status: 409, code: "DUPLICATE_REGISTRATION", message: "NIK sudah terdaftar untuk event ini" },
  REG_DEADLINE: { status: 403, code: "REGISTRATION_DEADLINE", message: "Batas pendaftaran telah melewati deadline" },
  REG_CLOSED: { status: 403, code: "REGISTRATION_CLOSED", message: "Pendaftaran sedang ditutup" },
  REG_PAYMENT_DISABLED: { status: 400, code: "PAYMENT_METHOD_UNAVAILABLE", message: "Metode pembayaran sedang tidak tersedia" },
  REG_CATEGORY_INVALID: { status: 400, code: "CATEGORY_INVALID", message: "Kategori tidak tersedia untuk event ini" },
  REG_AGE_INVALID: { status: 400, code: "AGE_REQUIREMENT", message: "Usia belum memenuhi syarat kategori" },
  REG_PRICING_UNAVAILABLE: { status: 409, code: "PRICING_UNAVAILABLE", message: "Tier harga tidak tersedia" },
  REG_ACCESS_TOKEN_INVALID: { status: 500, code: "REGISTRATION_UNAVAILABLE", message: "Token akses registrasi gagal dibuat" },
} as const;

function atomicErrorResponse(error: unknown) {
  const detail = typeof error === "object" && error !== null
    ? JSON.stringify(error)
    : String(error);
  const match = Object.entries(ATOMIC_ERRORS).find(([marker]) => detail.includes(marker));
  if (!match) return null;
  const [, response] = match;
  return NextResponse.json(
    { success: false, code: response.code, message: response.message },
    { status: response.status },
  );
}

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, "register", 5, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, code: "RATE_LIMITED", message: "Terlalu banyak percobaan. Tunggu sebentar." },
        { status: 429, headers: rateLimit.headers },
      );
    }

    const parsed = RegisterSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, code: "VALIDATION_ERROR", message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const eventType = data.eventType ?? "futuristic-run";
    const accessToken = randomBytes(32).toString("base64url");
    const health = await checkInsforgeHealth();
    if (!health.ok) {
      console.error("[POST /api/register] InsForge health check failed", health.error);
      return serviceUnavailable();
    }

    const participantPayload = {
      event_type: eventType,
      full_name: data.fullName.trim(),
      nik: data.nik || null,
      gender: data.gender,
      birth_place: data.birthPlace.trim(),
      birth_date: data.birthDate,
      phone: data.phone,
      email: data.email.toLowerCase().trim(),
      address: data.address.trim(),
      city: data.city.trim(),
      province: data.province.trim(),
      category: data.category,
      jersey_size: data.jerseySize,
      bib_name: (data.bibName ?? "").toUpperCase(),
      emergency_contact_name: data.emergencyContactName.trim(),
      emergency_contact_phone: data.emergencyContactPhone,
      blood_type: data.bloodType ?? null,
      payment_method: data.paymentMethod,
      medical_history: data.medicalHistory || null,
      running_club: eventType === "futuristic-run" ? (data.runningClub || null) : null,
      bike_type: eventType === "fun-bike" ? (data.bikeType || null) : null,
      registration_access_token_hash: hashRegistrationAccessToken(accessToken),
    };

    const { data: rows, error } = await insforge.database.rpc("register_participant_atomic_v4", {
      payload: participantPayload,
    });
    if (error) {
      const response = atomicErrorResponse(error);
      if (response) return response;
      console.error("[POST /api/register] atomic RPC failed", error);
      return NextResponse.json(
        { success: false, code: "REGISTRATION_UNAVAILABLE", message: "Pendaftaran sementara tidak tersedia. Silakan coba lagi." },
        { status: 503 },
      );
    }

    const result = Array.isArray(rows) ? rows[0] as AtomicRegistrationResult | undefined : undefined;
    if (!result?.reg_number) {
      throw new Error("Atomic registration returned no registration number");
    }

    sendRegistrationEmail({
      to: data.email,
      name: data.fullName,
      regNumber: result.reg_number,
      category: data.category,
      amount: result.price,
      paymentMethod: data.paymentMethod,
    }).catch(console.error);

    return NextResponse.json(
      { success: true, regNumber: result.reg_number, accessToken, price: result.price, pricingTier: result.pricing_tier_id, message: "Pendaftaran berhasil!" },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/register]", error);
    return NextResponse.json(
      { success: false, code: "SERVER_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
