import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { rateLimitOr429 } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const rl = rateLimitOr429(req, "check-reg", 20, 60_000);
  if (!rl.allowed) return rl.response;

  const regNumber = req.nextUrl.searchParams.get("regNumber")?.trim().toUpperCase();
  if (!regNumber || !/^(FR|FB)2026-\d{4,}$/.test(regNumber)) {
    return NextResponse.json(
      { found: false, message: "Format nomor registrasi tidak valid" },
      { status: 400 }
    );
  }

  const { data, error } = await insforge.database
    .from("participants")
    .select("reg_number, full_name, category, payment_status, status, bib_number, payment_proof, rejection_reason")
    .eq("reg_number", regNumber)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ found: false, message: "Nomor registrasi tidak ditemukan" });
  }

  return NextResponse.json({
    found: true,
    regNumber: data.reg_number,
    name: data.full_name,
    category: data.category,
    paymentStatus: data.payment_status,
    status: data.status,
    bibNumber: data.bib_number,
    paymentProof: data.payment_proof,
    rejectionReason: data.rejection_reason,
  });
}
