import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { insforge } from "@/lib/insforge";
import { VerifyPaymentSchema } from "@/lib/validations";
import { sendVerificationEmail, sendRejectionEmail } from "@/lib/email";
import { generateBibNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = VerifyPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  const { id, status, notes, bibNumber } = parsed.data;

  // Get participant
  const { data: participant, error: fetchError } = await insforge.database
    .from("participants")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !participant) {
    return NextResponse.json({ error: "Participant not found" }, { status: 404 });
  }

  const assignedBib = status === "verified"
    ? (bibNumber ?? generateBibNumber(id))
    : undefined;

  const updateData: Record<string, unknown> = {
    payment_status: status,
    verified_at: status === "verified" ? new Date().toISOString() : null,
    verified_by: status === "verified" ? (session.user?.email ?? "admin") : null,
    rejection_reason: status === "rejected" ? (notes ?? null) : null,
    bib_number: status === "verified" ? assignedBib : participant.bib_number,
  };

  const { data: updated, error: updateError } = await insforge.database
    .from("participants")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  // Send email notification (non-blocking)
  if (status === "verified") {
    sendVerificationEmail({
      to: participant.email,
      name: participant.full_name,
      regNumber: participant.reg_number,
      category: participant.category,
      bibNumber: assignedBib ?? null,
    }).catch(console.error);
  } else {
    sendRejectionEmail({
      to: participant.email,
      name: participant.full_name,
      regNumber: participant.reg_number,
      notes,
    }).catch(console.error);
  }

  // Audit log (fire-and-forget)
  void insforge.database
    .from("audit_logs")
    .insert([{
      entity: "participant",
      entity_id: id,
      action: `verify_${status}`,
      performed_by: session.user?.email ?? "admin",
      details: JSON.stringify({
        reg_number: participant.reg_number,
        from: participant.payment_status,
        to: status,
        notes: notes ?? null,
      }),
      created_at: new Date().toISOString(),
    }]);

  return NextResponse.json({ success: true, participant: updated });
}
