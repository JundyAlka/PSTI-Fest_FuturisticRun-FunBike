import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { insforge } from "@/lib/insforge";
import { sendRegistrationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id } = body as { id?: number };

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const { data: participant, error } = await insforge.database
    .from("participants")
    .select("id, email, full_name, reg_number, category, payment_amount, payment_method, event_type")
    .eq("id", id)
    .maybeSingle();

  if (error || !participant) {
    return NextResponse.json({ error: "Participant not found" }, { status: 404 });
  }

  try {
    await sendRegistrationEmail({
      to: participant.email,
      name: participant.full_name,
      regNumber: participant.reg_number,
      category: participant.category,
      amount: participant.payment_amount ?? 0,
      paymentMethod: participant.payment_method ?? "transfer",
    });

    // Audit log
    void insforge.database
      .from("audit_logs")
      .insert([{
        entity: "participant",
        entity_id: id,
        action: "resend_email",
        performed_by: session.user?.email ?? "admin",
        details: JSON.stringify({ reg_number: participant.reg_number }),
        created_at: new Date().toISOString(),
      }]);

    return NextResponse.json({ success: true, message: "Email berhasil dikirim ulang" });
  } catch (err) {
    console.error("[resend-email]", err);
    return NextResponse.json({ error: "Gagal mengirim email" }, { status: 500 });
  }
}
