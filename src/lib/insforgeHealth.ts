import { insforge } from "@/lib/insforge";

export type InsforgeHealthResult = {
  ok: boolean;
  error?: unknown;
};

export async function checkInsforgeHealth(): Promise<InsforgeHealthResult> {
  try {
    const { error } = await insforge.database
      .from("events")
      .select("slug")
      .limit(1);

    if (error) return { ok: false, error };
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export function serviceUnavailable(message = "Layanan pendaftaran sementara tidak tersedia. Coba lagi beberapa saat.") {
  return Response.json(
    { success: false, error: message, message },
    { status: 503 }
  );
}
