import { insforge } from "@/lib/insforge";

export type InsforgeHealthResult = {
  ok: boolean;
  error?: unknown;
};

export async function checkInsforgeHealth(timeoutMs = 5_000): Promise<InsforgeHealthResult> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const { error } = await Promise.race([
      Promise.resolve(insforge.database.from("events").select("slug").limit(1)),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("INSFORGE_HEALTH_TIMEOUT")), timeoutMs);
      }),
    ]);

    if (error) return { ok: false, error };
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function serviceUnavailable(message = "Layanan pendaftaran sementara tidak tersedia. Coba lagi beberapa saat.") {
  return Response.json(
    { success: false, error: message, message },
    { status: 503 }
  );
}
