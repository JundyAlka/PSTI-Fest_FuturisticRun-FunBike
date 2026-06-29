import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { insforge } from "@/lib/insforge";
import { EVENTS } from "@/content/events";
import Papa from "papaparse";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category") ?? "all";
  const status = searchParams.get("status") ?? "all";
  const eventType = searchParams.get("eventType") ?? "futuristic-run";

  let query = insforge.database
    .from("participants")
    .select("*")
    .eq("event_type", eventType)
    .order("created_at", { ascending: true });

  if (category !== "all") query = query.eq("category", category);
  if (status !== "all") query = query.eq("payment_status", status);

  const { data: participants, error } = await query;

  if (error) return NextResponse.json({ error: "Server error" }, { status: 500 });

  const rows = (participants ?? []).map((p) => ({
    "No. Registrasi": p.reg_number,
    "Event": p.event_type === "fun-bike" ? EVENTS["fun-bike"].name : EVENTS["futuristic-run"].name,
    "Nama Lengkap": p.full_name,
    NIK: p.nik,
    "Jenis Kelamin": p.gender === "male" ? "Laki-laki" : "Perempuan",
    "Tempat Lahir": p.birth_place,
    "Tanggal Lahir": new Date(p.birth_date).toLocaleDateString("id-ID"),
    Email: p.email,
    "No. HP": p.phone,
    Alamat: p.address,
    Kota: p.city,
    Provinsi: p.province,
    Kategori: p.category,
    "Ukuran Jersey": p.jersey_size,
    "Nama BIB": p.bib_name,
    "Nomor BIB": p.bib_number ?? "-",
    "Golongan Darah": p.blood_type ?? "-",
    "Kontak Darurat": p.emergency_contact_name ?? "-",
    "HP Darurat": p.emergency_contact_phone ?? "-",
    "Metode Pembayaran": p.payment_method ?? "-",
    "Status Pembayaran": p.payment_status,
    "Biaya (Rp)": p.payment_amount,
    "Tanggal Daftar": new Date(p.created_at).toLocaleString("id-ID"),
    "Diverifikasi Oleh": p.verified_by ?? "-",
    "Tanggal Verifikasi": p.verified_at ? new Date(p.verified_at).toLocaleString("id-ID") : "-",
    Catatan: p.rejection_reason ?? "-",
  }));

  const csv = Papa.unparse(rows, { quotes: true });

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${eventType}-peserta-${Date.now()}.csv"`,
    },
  });
}
