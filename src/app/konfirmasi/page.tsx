import ConfirmationContent from "@/components/ConfirmationContent";
import EventNavbar from "@/components/EventNavbar";
import EventThemeProvider from "@/components/EventThemeProvider";
import type { Metadata } from "next";
import { FEST_FULL_NAME } from "@/content/brand";

export const metadata: Metadata = {
  title: `Konfirmasi Pembayaran - ${FEST_FULL_NAME}`,
  description: `Konfirmasi pembayaran peserta ${FEST_FULL_NAME} menggunakan nomor registrasi yang valid.`,
};

type KonfirmasiPageProps = {
  searchParams: Promise<{ reg?: string; event?: string }>;
};

export default async function KonfirmasiPage({ searchParams }: KonfirmasiPageProps) {
  const params = await searchParams;
  const reg = params.reg?.trim().toUpperCase() ?? "";
  const requestedEvent = params.event?.trim().toLowerCase();
  const isBike = reg.startsWith("FB2026-") ||
    (!reg.startsWith("FR2026-") && (requestedEvent === "bike" || requestedEvent === "fun-bike"));
  const eventType = isBike ? "fun-bike" : "futuristic-run";

  return (
    <EventThemeProvider eventType={eventType}>
      <main className={`page-animate relative min-h-screen overflow-hidden ${isBike ? "bg-[#FFF7ED]" : "bg-[#070B1A]"}`}>
        <EventNavbar
          brand={{
            title: isBike ? "Futuristic Bike" : "Futuristic Run",
            subtitle: "2026",
            href: isBike ? "/fun-bike" : "/futuristic-run",
          }}
          navLinks={[{ label: "Kembali ke Info", href: isBike ? "/fun-bike" : "/futuristic-run", isRoute: true }]}
          registerPath={isBike ? "/fun-bike/daftar" : "/futuristic-run/daftar"}
          registerLabel="DAFTAR"
          theme={isBike ? "light" : "dark"}
          accentColor={isBike ? "#FF7A18" : "#00E5FF"}
        />
        <div
          className={`absolute inset-0 ${isBike ? "opacity-[0.16]" : "opacity-[0.03]"}`}
          style={{
            backgroundImage: `radial-gradient(${isBike ? "rgba(255,122,24,0.28)" : "rgba(0,229,255,0.5)"} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className={`absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r blur-3xl ${isBike ? "from-[#FF7A18] to-[#F59E0B] opacity-[0.10]" : "from-[#00E5FF] to-[#2A4FFF] opacity-[0.08]"}`} />
        <div className={`absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full blur-3xl ${isBike ? "bg-[#38BDF8] opacity-[0.07]" : "bg-[#8B00FF] opacity-[0.05]"}`} />
        <div className={`absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full blur-3xl ${isBike ? "bg-[#F59E0B] opacity-[0.07]" : "bg-[#00E5FF] opacity-[0.04]"}`} />
        <ConfirmationContent eventType={eventType} />
      </main>
    </EventThemeProvider>
  );
}
