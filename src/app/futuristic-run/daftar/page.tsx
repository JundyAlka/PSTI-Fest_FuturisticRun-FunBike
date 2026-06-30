import RegistrationForm from "@/components/forms/RegistrationForm";
import EventNavbar from "@/components/EventNavbar";
import EventThemeProvider from "@/components/EventThemeProvider";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import type { Metadata } from "next";
import { EVENT_SEO, registerMetadata } from "@/lib/seo";
import { getPublicEventOps } from "@/lib/eventOps";

export const metadata: Metadata = registerMetadata(EVENT_SEO["futuristic-run"]);

export default async function DaftarPage() {
  const eventOps = await getPublicEventOps("futuristic-run");
  return (
    <EventThemeProvider eventType="futuristic-run">
      <main className="page-animate min-h-screen bg-[#0A0E27] relative overflow-hidden">
        <EventNavbar
          brand={{ title: "Futuristic Run", subtitle: "2026", href: "/futuristic-run" }}
          navLinks={[{ label: "Kembali ke Info", href: "/futuristic-run", isRoute: true }]}
          registerPath="/futuristic-run/daftar"
          registerLabel="DAFTAR"
          theme="dark"
          accentColor="#00E5FF"
        />
        {/* BG effects */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,229,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-3xl opacity-[0.07] bg-gradient-to-r from-[#2A4FFF] to-[#8B00FF]" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.05] bg-[#00E5FF]" />
        <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.05] bg-[#8B00FF]" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          <div className="section-reveal text-center mb-10">
            <div className="badge-neon inline-block mb-4">PENDAFTARAN ONLINE</div>
            <AnimatedSectionTitle text="DAFTAR SEKARANG" level={1} className="text-4xl sm:text-5xl font-black mb-3" />
            <p className="text-[#B0C4DE]">Isi formulir berikut untuk bergabung di Futuristic Run 2026</p>
          </div>
          <div className="section-reveal-delay-1">
            <RegistrationForm eventType="futuristic-run" defaultPrice={eventOps.price ?? undefined}
              currentTierLabel={eventOps.currentTierLabel} presaleRemaining={eventOps.presaleRemaining}
              presaleQuota={eventOps.presaleQuota} normalPrice={eventOps.normalPrice} />
          </div>
        </div>
      </main>
    </EventThemeProvider>
  );
}
