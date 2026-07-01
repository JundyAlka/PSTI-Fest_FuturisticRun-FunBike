import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { insforge } from "@/lib/insforge";
import { EVENTS } from "@/content/events";
import * as xlsx from "xlsx";
import { writeActivityLog } from "@/lib/serverAudit";

type ExportParticipant = {
  reg_number: string;
  event_type: string;
  full_name: string;
  nik: string | null;
  gender: string | null;
  birth_place: string | null;
  birth_date: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  category: string | null;
  jersey_size: string | null;
  bib_name: string | null;
  bib_number: string | null;
  blood_type: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  payment_method: string | null;
  payment_status: string | null;
  payment_amount: number | null;
  created_at: string;
  verified_by: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
};

function formatDate(value: string | null, withTime = false) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return withTime ? date.toLocaleString("id-ID") : date.toLocaleDateString("id-ID");
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category") ?? "all";
  const status = searchParams.get("status") ?? "all";
  const requestedEventType = searchParams.get("eventType") ?? "all";

  let query = insforge.database
    .from("participants")
    .select("*")
    .order("created_at", { ascending: true });

  if (requestedEventType !== "all") query = query.eq("event_type", requestedEventType);
  if (category !== "all") query = query.eq("category", category);
  if (status !== "all") query = query.eq("payment_status", status);

  const { data: participants, error } = await query;

  if (error) return NextResponse.json({ error: "Server error" }, { status: 500 });

  const list = (participants ?? []) as ExportParticipant[];
  const mapRow = (p: ExportParticipant) => ({
    "No. Registrasi": p.reg_number,
    "Event": p.event_type === "fun-bike" ? EVENTS["fun-bike"].name : EVENTS["futuristic-run"].name,
    "Nama Lengkap": p.full_name,
    NIK: p.nik,
    "Jenis Kelamin": p.gender === "male" ? "Laki-laki" : p.gender === "female" ? "Perempuan" : "-",
    "Tempat Lahir": p.birth_place,
    "Tanggal Lahir": formatDate(p.birth_date),
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
    "Tanggal Daftar": formatDate(p.created_at, true),
    "Diverifikasi Oleh": p.verified_by ?? "-",
    "Tanggal Verifikasi": formatDate(p.verified_at, true),
    Catatan: p.rejection_reason ?? "-",
  });

  const allRows = list.map(mapRow);
  const funRunRows = list.filter((p) => p.event_type === "futuristic-run").map(mapRow);
  const funBikeRows = list.filter((p) => p.event_type === "fun-bike").map(mapRow);

  const wb = xlsx.utils.book_new();

  const wsAll = xlsx.utils.json_to_sheet(allRows);
  xlsx.utils.book_append_sheet(wb, wsAll, "Semua Event");

  const wsFunRun = xlsx.utils.json_to_sheet(funRunRows);
  xlsx.utils.book_append_sheet(wb, wsFunRun, "Futuristic Run");

  const wsFunBike = xlsx.utils.json_to_sheet(funBikeRows);
  xlsx.utils.book_append_sheet(wb, wsFunBike, "Fun Bike");

  const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

  void writeActivityLog({
    actorType: "admin",
    actorLabel: session.user.email ?? "admin",
    eventType: requestedEventType,
    action: "participants_exported",
    entityType: "participants",
    entityId: requestedEventType,
    metadata: {
      category,
      status,
      rowCount: allRows.length,
      format: "xlsx"
    },
  }, req);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${requestedEventType === "all" ? "semua" : requestedEventType}-peserta-${Date.now()}.xlsx"`,
    },
  });
}
