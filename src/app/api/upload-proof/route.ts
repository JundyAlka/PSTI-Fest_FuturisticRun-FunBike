import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { checkRateLimit } from "@/lib/rateLimit";
import { PAYMENT_PROOF_MAX_SIZE, PAYMENT_PROOF_TYPES } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rl = checkRateLimit(req, "upload-proof", 10, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak upload. Tunggu sebentar." },
        { status: 429, headers: rl.headers }
      );
    }

    const regNumber = req.nextUrl.searchParams.get("regNumber");
    if (!regNumber) {
      return NextResponse.json({ error: "regNumber required" }, { status: 400 });
    }

    // Verify participant exists
    const { data: participant, error: pError } = await insforge.database
      .from("participants")
      .select("id, reg_number, payment_status")
      .eq("reg_number", regNumber)
      .maybeSingle();

    if (pError || !participant) {
      return NextResponse.json({ error: "Nomor registrasi tidak ditemukan" }, { status: 404 });
    }

    if (participant.payment_status === "verified") {
      return NextResponse.json({ error: "Pembayaran sudah diverifikasi" }, { status: 400 });
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Validate file type
    if (!PAYMENT_PROOF_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau PDF." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > PAYMENT_PROOF_MAX_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    // Upload to InsForge storage
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `payment-proofs/${regNumber}-${Date.now()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // InsForge storage: upload(path, File/Blob) returns { data, error }
    const blob = new Blob([buffer], { type: file.type });
    const { data: uploadData, error: uploadError } = await insforge.storage
      .from("payment-proofs")
      .upload(fileName, blob);

    if (uploadError) {
      console.error("[upload-proof] Storage error:", uploadError);
      return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
    }

    // InsForge storage: getPublicUrl(path) returns string directly
    const publicUrl = insforge.storage.from("payment-proofs").getPublicUrl(fileName);

    // Update participant record
    await insforge.database
      .from("participants")
      .update({ payment_proof: publicUrl })
      .eq("id", participant.id);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: "Bukti pembayaran berhasil diunggah",
    });
  } catch (err) {
    console.error("[POST /api/upload-proof]", err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
