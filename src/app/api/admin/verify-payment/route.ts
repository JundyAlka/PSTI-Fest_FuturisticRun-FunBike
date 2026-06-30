import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { insforge } from "@/lib/insforge";
import { VerifyPaymentSchema } from "@/lib/validations";
import { sendVerificationEmail, sendRejectionEmail } from "@/lib/email";
import { generateBibNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
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

  const { data: reviewRows, error: updateError } = await insforge.database.rpc("review_participant_payment_v1", {
    p_participant_id: id,
    p_status: status,
    p_reason: notes ?? "",
    p_actor: session.user.email ?? "admin",
    p_bib_number: assignedBib ?? null,
  });

  if (updateError) {
    const detail = JSON.stringify(updateError);
    const message = detail.includes("PAYMENT_PROOF_REQUIRED") ? "Bukti pembayaran belum tersedia."
      : detail.includes("PAYMENT_ALREADY_REVIEWED") ? "Pembayaran sudah pernah ditinjau."
      : detail.includes("PAYMENT_REJECTION_REASON_REQUIRED") ? "Alasan penolakan wajib diisi."
      : "Status pembayaran gagal diperbarui.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
  const updated = Array.isArray(reviewRows) ? reviewRows[0] : reviewRows;

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

  return NextResponse.json({ success: true, participant: updated });
}
