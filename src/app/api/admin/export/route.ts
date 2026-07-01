import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { insforge } from "@/lib/insforge";
import { EVENTS } from "@/content/events";
import * as xlsx from "xlsx";
import { writeActivityLog } from "@/lib/serverAudit";

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

  const mapRow = (p: any) => ({
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
  });

  const allRows = (participants ?? []).map(mapRow);
  const funRunRows = (participants ?? []).filter((p) => p.event_type === "futuristic-run").map(mapRow);
  const funBikeRows = (participants ?? []).filter((p) => p.event_type === "fun-bike").map(mapRow);

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
