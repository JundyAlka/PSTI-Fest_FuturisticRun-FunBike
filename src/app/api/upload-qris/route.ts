import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { insforge } from "@/lib/insforge";
import { checkInsforgeHealth, serviceUnavailable } from "@/lib/insforgeHealth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const eventType = req.nextUrl.searchParams.get("eventType") ?? "futuristic-run";
    const health = await checkInsforgeHealth();
    if (!health.ok) return serviceUnavailable("Upload QRIS sementara tidak tersedia. Coba lagi beberapa saat.");

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Format harus JPG, PNG, atau WebP" }, { status: 400 });
    }

    if (file.size > 3 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 3MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "png";
    const fileName = `qris/${eventType}-${Date.now()}.${ext}`;
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });

    const { data: uploadData, error: uploadError } = await insforge.storage
      .from("qris-images")
      .upload(fileName, blob);

    if (uploadError) {
      console.error("[upload-qris] Storage error:", uploadError);
      return NextResponse.json({ error: "Gagal mengunggah QRIS" }, { status: 500 });
    }

    const publicUrl = uploadData?.url ?? insforge.storage.from("qris-images").getPublicUrl(fileName);
    const objectKey = uploadData?.key ?? fileName;

    // Auto-update the setting
    const { data: existing } = await insforge.database
      .from("event_settings")
      .select("id")
      .eq("event_type", eventType)
      .eq("key", "payment_qris_image_url")
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await insforge.database
        .from("event_settings")
        .update({ value: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await insforge.database
        .from("event_settings")
        .insert([{ event_type: eventType, key: "payment_qris_image_url", value: publicUrl }]);
      if (insertError) throw insertError;
    }

    const { data: existingKey } = await insforge.database
      .from("event_settings")
      .select("id")
      .eq("event_type", eventType)
      .eq("key", "payment_qris_image_key")
      .maybeSingle();

    const keyResult = existingKey
      ? await insforge.database.from("event_settings").update({ value: objectKey }).eq("id", existingKey.id)
      : await insforge.database.from("event_settings").insert([
          { event_type: eventType, key: "payment_qris_image_key", value: objectKey },
        ]);
    if (keyResult.error) throw keyResult.error;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error("[POST /api/upload-qris]", err);
    return serviceUnavailable("Upload QRIS sementara tidak tersedia. Coba lagi beberapa saat.");
  }
}
