import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { RegisterSchema } from "@/lib/validations";
import { generateRegistrationNumber, getEventCategories } from "@/lib/utils";
import { sendRegistrationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
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

    // Fetch categories for this event
    const categories = await getEventCategories(eventType);
    const catRow = categories.find((c) => c.code === data.category);
    if (!catRow) {
      return NextResponse.json(
        { success: false, message: `Kategori '${data.category}' tidak tersedia untuk event ini` },
        { status: 400 }
      );
    }

    // Check event-level settings
    const { data: settings, error: settingsError } = await insforge.database
      .from("event_settings")
      .select("key, value")
      .eq("event_type", eventType)
      .in("key", ["registration_open"]);

    if (settingsError) throw settingsError;

    const settingsMap = Object.fromEntries((settings ?? []).map((setting) => [setting.key, setting.value]));

    if (settingsMap.registration_open !== "true") {
      return NextResponse.json({ success: false, message: "Pendaftaran sedang ditutup" }, { status: 403 });
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

    let existing = null;
    if (data.nik) {
      const { data: duplicate, error: duplicateError } = await insforge.database
        .from("participants")
        .select("id")
        .eq("nik", data.nik)
        .eq("event_type", eventType)
        .maybeSingle();

      if (duplicateError) throw duplicateError;
      existing = duplicate;
    }

    if (existing) {
      return NextResponse.json({ success: false, message: "NIK sudah terdaftar untuk event ini" }, { status: 409 });
    }

    const amount = catRow.price;

    const { data: participant, error: insertError } = await insforge.database
      .from("participants")
      .insert([{
        reg_number: `${eventType.toUpperCase().replace(/-/g, "")}-TEMP-${Date.now()}`,
        event_type: eventType,
        full_name: data.fullName.trim(),
        nik: data.nik,
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
        bib_name: data.bibName.toUpperCase(),
        emergency_contact_name: data.emergencyContactName.trim(),
        emergency_contact_phone: data.emergencyContactPhone,
        blood_type: data.bloodType ?? null,
        payment_method: data.paymentMethod,
        payment_status: "pending",
        payment_amount: amount,
        status: "registered",
      }])
      .select()
      .single();

    if (insertError || !participant) {
      throw insertError ?? new Error("Insert failed");
    }

    // Update with proper reg number
    const regNumber = generateRegistrationNumber(eventType, participant.id);
    await insforge.database
      .from("participants")
      .update({ reg_number: regNumber })
      .eq("id", participant.id);

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
