import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { checkRateLimit } from "@/lib/rateLimit";
import { PAYMENT_PROOF_MAX_SIZE, PAYMENT_PROOF_TYPES } from "@/lib/validations";
import { serviceUnavailable } from "@/lib/insforgeHealth";
import { randomUUID } from "node:crypto";
import { verifyRegistrationAccess } from "@/lib/registrationAccess";

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

    const regNumber = (req.nextUrl.searchParams.get("reg") ?? req.nextUrl.searchParams.get("regNumber"))?.trim().toUpperCase();
    if (!regNumber || !/^(FR|FB)2026-\d{4,}$/.test(regNumber)) {
      return NextResponse.json({ error: "Nomor registrasi tidak valid" }, { status: 400 });
    }

    // Verify participant exists
    const { data: participant, error: pError } = await insforge.database
      .from("participants")
      .select("id, reg_number, phone, email, payment_status, payment_proof, payment_proof_key, registration_access_token_hash")
      .eq("reg_number", regNumber)
      .maybeSingle();

    const accessToken = req.headers.get("x-registration-token");
    const contact = req.headers.get("x-registration-contact");
    if (pError) {
      console.error("[upload-proof] Participant lookup failed");
      return serviceUnavailable("Upload bukti pembayaran sementara tidak tersedia. Coba lagi beberapa saat.");
    }
    if (!participant || !verifyRegistrationAccess(participant, accessToken, contact)) {
      return NextResponse.json({ error: "Nomor registrasi atau verifikasi kontak tidak valid" }, { status: 404 });
    }

    if (participant.payment_status === "verified") {
      return NextResponse.json({ error: "Pembayaran sudah diverifikasi" }, { status: 400 });
    }
    if (participant.payment_proof && participant.payment_status !== "rejected") {
      return NextResponse.json({ error: "Bukti pembayaran sudah tersimpan dan sedang menunggu verifikasi" }, { status: 409 });
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
    const extensionByType: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "application/pdf": "pdf",
    };
    const ext = extensionByType[file.type];
    const fileName = `payment-proofs/${regNumber}/${Date.now()}-${randomUUID()}.${ext}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);

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
    const publicUrl = uploadData?.url ?? insforge.storage.from("payment-proofs").getPublicUrl(fileName);
    const objectKey = uploadData?.key ?? fileName;

    // Update participant record
    const { error: updateError } = await insforge.database
      .from("participants")
      .update({
        payment_proof: publicUrl,
        payment_proof_key: objectKey,
        payment_proof_mime: file.type,
        payment_proof_size: file.size,
        payment_proof_name: originalName,
        paid_at: new Date().toISOString(),
        payment_status: "pending",
        rejection_reason: null,
        verified_at: null,
        verified_by: null,
      })
      .eq("id", participant.id);

    if (updateError) {
      console.error("[upload-proof] Database update failed");
      void insforge.storage.from("payment-proofs").remove(objectKey);
      return NextResponse.json({ error: "File terunggah, tetapi data belum dapat disimpan. Silakan coba lagi." }, { status: 503 });
    }

    if (participant.payment_proof_key && participant.payment_status === "rejected") {
      void insforge.storage.from("payment-proofs").remove(participant.payment_proof_key);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      status: "menunggu_verifikasi",
      message: "Bukti pembayaran berhasil diunggah",
    });
  } catch (err) {
    console.error("[POST /api/upload-proof]", err);
    return serviceUnavailable("Upload bukti pembayaran sementara tidak tersedia. Coba lagi beberapa saat.");
  }
}
