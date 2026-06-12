import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";

export async function GET(req: NextRequest) {
  const regNumber = req.nextUrl.searchParams.get("regNumber");
  if (!regNumber) {
    return NextResponse.json({ found: false, message: "regNumber required" }, { status: 400 });
  }

  const { data, error } = await insforge.database
    .from("participants")
    .select("reg_number, full_name, category, payment_status, status, bib_number")
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
  });
}
