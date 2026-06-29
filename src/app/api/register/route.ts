import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { RegisterSchema } from "@/lib/validations";
import { generateRegistrationNumber, getEventCategories, getEventInfo } from "@/lib/utils";
import { sendRegistrationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";
import { checkInsforgeHealth, serviceUnavailable } from "@/lib/insforgeHealth";

type AtomicRegistrationResult = {
  reg_number: string;
  id: number;
};

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rl = checkRateLimit(req, "register", 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, message: "Terlalu banyak percobaan. Tunggu sebentar." },
        { status: 429, headers: rl.headers }
      );
    }

    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const eventType = data.eventType ?? "futuristic-run";
    const health = await checkInsforgeHealth();
    if (!health.ok) {
      console.error("[POST /api/register] InsForge health check failed", health.error);
      return serviceUnavailable();
    }

    // Fetch categories for this event
    const categories = await getEventCategories(eventType);
    const catRow = categories.find((c) => c.code === data.category);
    if (!catRow) {
      return NextResponse.json(
        { success: false, message: `Kategori '${data.category}' tidak tersedia untuk event ini` },
        { status: 400 }
      );
    }

    // Check event-level settings (registration_open + deadline)
    const { data: settings, error: settingsError } = await insforge.database
      .from("event_settings")
      .select("key, value")
      .eq("event_type", eventType)
      .in("key", ["registration_open", "registration_deadline"]);

    if (settingsError) throw settingsError;

    const settingsMap = Object.fromEntries((settings ?? []).map((setting) => [setting.key, setting.value]));

    if (settingsMap.registration_open !== "true") {
      return NextResponse.json({ success: false, message: "Pendaftaran sedang ditutup" }, { status: 403 });
    }

    // Check deadline
    if (settingsMap.registration_deadline) {
      const deadline = new Date(settingsMap.registration_deadline);
      if (!isNaN(deadline.getTime()) && new Date() > deadline) {
        return NextResponse.json({ success: false, message: "Batas pendaftaran telah melewati deadline" }, { status: 403 });
      }
    }

    // Also check event-level deadline from events table
    const eventInfo = await getEventInfo(eventType);
    if (eventInfo?.deadline) {
      const deadline = new Date(eventInfo.deadline);
      if (!isNaN(deadline.getTime()) && new Date() > deadline) {
        return NextResponse.json({ success: false, message: "Batas pendaftaran telah melewati deadline" }, { status: 403 });
      }
    }

    // Age validation based on category min_age
    if (catRow.min_age && data.birthDate) {
      const birth = new Date(data.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      if (age < catRow.min_age) {
        return NextResponse.json(
          { success: false, message: `Usia minimum untuk kategori ini adalah ${catRow.min_age} tahun` },
          { status: 400 }
        );
      }
    }

    // Quota check: use DB category quota, fallback to 200
    const { count: filled, error: quotaError } = await insforge.database
      .from("participants")
      .select("*", { count: "exact", head: true })
      .eq("event_type", eventType)
      .eq("category", data.category)
      .neq("payment_status", "rejected");

    if (quotaError) throw quotaError;

    const quota = catRow.quota ?? 200;

    if ((filled ?? 0) >= quota) {
      return NextResponse.json(
        { success: false, message: `Kuota kategori ${data.category} sudah penuh` },
        { status: 409 }
      );
    }

    // NIK duplicate check per event
    if (data.nik && /^\d{16}$/.test(data.nik)) {
      const { data: duplicate, error: duplicateError } = await insforge.database
        .from("participants")
        .select("id")
        .eq("nik", data.nik)
        .eq("event_type", eventType)
        .neq("payment_status", "rejected")
        .maybeSingle();

      if (duplicateError) throw duplicateError;
      if (duplicate) {
        return NextResponse.json({ success: false, message: "NIK sudah terdaftar untuk event ini" }, { status: 409 });
      }
    }

    // Payment method validation — check if method is enabled
    const { data: paymentSettings } = await insforge.database
      .from("event_settings")
      .select("key, value")
      .eq("event_type", eventType)
      .in("key", ["payment_transfer_enabled", "payment_qris_enabled"]);

    const paymentMap = Object.fromEntries((paymentSettings ?? []).map((s) => [s.key, s.value]));
    if (data.paymentMethod === "transfer" && paymentMap.payment_transfer_enabled === "false") {
      return NextResponse.json({ success: false, message: "Metode transfer bank sedang tidak tersedia" }, { status: 400 });
    }
    if (data.paymentMethod === "qris" && paymentMap.payment_qris_enabled === "false") {
      return NextResponse.json({ success: false, message: "Metode QRIS sedang tidak tersedia" }, { status: 400 });
    }

    const amount = catRow.price;

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
        payment_status: "pending",
        payment_amount: amount,
        status: "registered",
        medical_history: data.medicalHistory || null,
        running_club: eventType === "futuristic-run" ? (data.runningClub || null) : null,
        bike_type: eventType === "fun-bike" ? (data.bikeType || null) : null,
    };

    let regNumber = "";

    const { data: atomicRows, error: atomicError } = await insforge.database.rpc("register_participant_atomic", {
      payload: participantPayload,
    });

    const atomicResult = Array.isArray(atomicRows) ? atomicRows[0] as AtomicRegistrationResult | undefined : undefined;

    if (!atomicError && atomicResult?.reg_number) {
      regNumber = atomicResult.reg_number;
    } else {
      if (atomicError) {
        console.warn("[POST /api/register] Atomic registration unavailable, falling back to compatibility insert");
      }

      const tempReg = `${eventType.toUpperCase().replace(/-/g, "")}-TEMP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const { data: participant, error: insertError } = await insforge.database
        .from("participants")
        .insert([{
          reg_number: tempReg,
          ...participantPayload,
        }])
        .select()
        .single();

      if (insertError || !participant) {
        throw insertError ?? new Error("Insert failed");
      }

      regNumber = generateRegistrationNumber(eventType, participant.id);
      const { error: updateError } = await insforge.database
        .from("participants")
        .update({ reg_number: regNumber })
        .eq("id", participant.id)
        .eq("reg_number", tempReg);

      if (updateError) throw updateError;
    }

    // Send email (non-blocking)
    sendRegistrationEmail({
      to: data.email,
      name: data.fullName,
      regNumber,
      category: data.category,
      amount,
      paymentMethod: data.paymentMethod,
    }).catch(console.error);

    return NextResponse.json({ success: true, regNumber, message: "Pendaftaran berhasil!" }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/register]", err);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
