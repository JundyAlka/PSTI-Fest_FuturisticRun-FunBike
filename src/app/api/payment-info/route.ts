import { NextRequest, NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";
import { rateLimitOr429 } from "@/lib/rateLimit";
import { checkInsforgeHealth, serviceUnavailable } from "@/lib/insforgeHealth";

export async function GET(req: NextRequest) {
  try {
    const rl = rateLimitOr429(req, "payment-info", 30, 60_000);
    if (!rl.allowed) return rl.response;

    const health = await checkInsforgeHealth();
    if (!health.ok) return serviceUnavailable("Informasi pembayaran sementara tidak tersedia. Coba lagi beberapa saat.");

    const eventType = req.nextUrl.searchParams.get("eventType") ?? "futuristic-run";

    const { data: settings, error } = await insforge.database
      .from("event_settings")
      .select("key, value")
      .eq("event_type", eventType)
      .in("key", [
        "payment_bank_name",
        "payment_bank_account",
        "payment_bank_holder",
        "payment_qris_nmid",
        "payment_qris_image_url",
        "registration_fee",
        "payment_transfer_enabled",
        "payment_qris_enabled",
      ]);

    if (error) throw error;

    const map = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]));

    return NextResponse.json({
      bankName: map.payment_bank_name ?? "BRI",
      bankAccount: map.payment_bank_account ?? "-",
      bankHolder: map.payment_bank_holder ?? "Himatekno UMP",
      qrisNmid: map.payment_qris_nmid ?? "-",
      qrisImageUrl: map.payment_qris_image_url ?? "",
      registrationFee: parseInt(map.registration_fee ?? "200000"),
      transferEnabled: map.payment_transfer_enabled === "true",
      qrisEnabled: map.payment_qris_enabled === "true",
    });
  } catch (err) {
    console.error("[GET /api/payment-info]", err);
    return serviceUnavailable("Informasi pembayaran sementara tidak tersedia. Coba lagi beberapa saat.");
  }
}
