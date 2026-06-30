import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { rateLimitOr429 } from "@/lib/rateLimit";
import { verifyRegistrationAccess } from "@/lib/registrationAccess";

const PUBLIC_PAYMENT_STATUS: Record<string, string> = {
  pending: "menunggu_verifikasi",
  verified: "terverifikasi",
  rejected: "ditolak",
};

export async function GET(req: NextRequest) {
  const rl = rateLimitOr429(req, "check-reg", 20, 60_000);
  if (!rl.allowed) return rl.response;

  const regNumber = (req.nextUrl.searchParams.get("reg") ?? req.nextUrl.searchParams.get("regNumber"))?.trim().toUpperCase();
  if (!regNumber || !/^(FR|FB)2026-\d{4,}$/.test(regNumber)) {
    return NextResponse.json(
      { found: false, message: "Format nomor registrasi tidak valid" },
      { status: 400 }
    );
  }

  const { data, error } = await insforge.database
    .from("participants")
    .select("reg_number, event_type, full_name, phone, email, category, jersey_size, bike_type, emergency_contact_name, emergency_contact_phone, payment_method, payment_status, payment_amount, price, pricing_tier_id, status, bib_number, payment_proof, rejection_reason, created_at, registration_access_token_hash")
    .eq("reg_number", regNumber)
    .maybeSingle();

  const accessToken = req.headers.get("x-registration-token") ?? req.nextUrl.searchParams.get("accessToken");
  const contact = req.headers.get("x-registration-contact") ?? req.nextUrl.searchParams.get("contact");
  if (error || !data || !verifyRegistrationAccess(data ?? {}, accessToken, contact)) {
    return NextResponse.json(
      { found: false, message: "Nomor registrasi atau verifikasi kontak tidak valid" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json({
    found: true,
    regNumber: data.reg_number,
    eventType: data.event_type,
    name: data.full_name,
    phone: data.phone,
    email: data.email,
    category: data.category,
    jerseySize: data.jersey_size,
    bikeType: data.bike_type,
    emergencyContactName: data.emergency_contact_name,
    emergencyContactPhone: data.emergency_contact_phone,
    paymentMethod: data.payment_method,
    paymentStatus: PUBLIC_PAYMENT_STATUS[data.payment_status] ?? data.payment_status,
    paymentStatusCode: data.payment_status,
    paymentAmount: data.price ?? data.payment_amount,
    pricingTier: data.pricing_tier_id,
    registrationCreatedAt: data.created_at,
    status: data.status,
    bibNumber: data.bib_number,
    paymentProof: data.payment_proof,
    rejectionReason: data.rejection_reason,
    notes: data.rejection_reason,
  }, { headers: { "Cache-Control": "no-store" } });
}
