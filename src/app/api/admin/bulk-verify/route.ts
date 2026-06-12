import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { insforge } from "@/lib/insforge";
import { generateBibNumber } from "@/lib/utils";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { ids, status } = body as { ids?: number[]; status?: string };

  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 50) {
    return NextResponse.json({ error: "ids must be 1-50 items" }, { status: 400 });
  }
  if (status !== "verified" && status !== "rejected") {
    return NextResponse.json({ error: "status must be verified or rejected" }, { status: 400 });
  }

  const adminEmail = session.user?.email ?? "admin";
  const results: { id: number; success: boolean; error?: string }[] = [];

  for (const id of ids) {
    try {
      const { data: participant } = await insforge.database
        .from("participants")
        .select("id, email, full_name, reg_number, category, payment_status")
        .eq("id", id)
        .maybeSingle();

      if (!participant) {
        results.push({ id, success: false, error: "Not found" });
        continue;
      }

      const bib = status === "verified" ? generateBibNumber(id) : undefined;

      await insforge.database
        .from("participants")
        .update({
          payment_status: status,
          verified_at: status === "verified" ? new Date().toISOString() : null,
          verified_by: status === "verified" ? adminEmail : null,
          bib_number: status === "verified" ? bib : null,
        })
        .eq("id", id);

      // Audit log (fire-and-forget)
      void insforge.database
        .from("audit_logs")
        .insert([{
          entity: "participant",
          entity_id: id,
          action: `bulk_${status}`,
          performed_by: adminEmail,
          details: JSON.stringify({ reg_number: participant.reg_number, from: participant.payment_status }),
          created_at: new Date().toISOString(),
        }]);

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
