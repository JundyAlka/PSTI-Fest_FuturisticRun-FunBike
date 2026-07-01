import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { insforge } from "@/lib/insforge";
import { generateBibNumber } from "@/lib/utils";
import { sendVerificationEmail } from "@/lib/email";
import { writeActivityLog } from "@/lib/serverAudit";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { ids, status } = body as { ids?: number[]; status?: string };

  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 50) {
    return NextResponse.json({ error: "ids must be 1-50 items" }, { status: 400 });
  }
  if (status !== "verified") {
    return NextResponse.json({ error: "Penolakan wajib dilakukan satu per satu dengan alasan." }, { status: 400 });
  }

  const adminEmail = session.user?.email ?? "admin";
  const results: { id: number; success: boolean; error?: string }[] = [];

  for (const id of ids) {
    try {
      const { data: participant } = await insforge.database
        .from("participants")
        .select("id, email, full_name, reg_number, category, event_type, payment_status")
        .eq("id", id)
        .maybeSingle();

      if (!participant) {
        results.push({ id, success: false, error: "Not found" });
        continue;
      }

      const bib = status === "verified" ? generateBibNumber(id) : undefined;

      const { error: reviewError } = await insforge.database.rpc("review_participant_payment_v1", {
        p_participant_id: id,
        p_status: "verified",
        p_reason: "",
        p_actor: adminEmail,
        p_bib_number: bib ?? null,
      });
      if (reviewError) {
        results.push({ id, success: false, error: "Bukti belum tersedia atau pembayaran sudah ditinjau" });
        continue;
      }

      // Send email (non-blocking)
      if (status === "verified") {
        sendVerificationEmail({
          to: participant.email,
          name: participant.full_name,
          regNumber: participant.reg_number,
          category: participant.category,
          bibNumber: bib ?? null,
        }).catch(console.error);
      }

      results.push({ id, success: true });
      void writeActivityLog({
        actorType: "admin",
        actorLabel: adminEmail,
        eventType: participant.event_type,
        action: "payment_verified_bulk",
        entityType: "participant",
        entityId: participant.reg_number,
        metadata: { participantId: id, bibNumber: bib ?? null },
      }, req);
    } catch {
      results.push({ id, success: false, error: "Update failed" });
    }
  }

  const successCount = results.filter((r) => r.success).length;
  return NextResponse.json({
    success: true,
    processed: results.length,
    successCount,
    failedCount: results.length - successCount,
    results,
  });
}
