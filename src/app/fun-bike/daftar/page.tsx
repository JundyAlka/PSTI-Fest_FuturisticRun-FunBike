import RegistrationForm from "@/components/forms/RegistrationForm";
import EventNavbar from "@/components/EventNavbar";
import EventThemeProvider from "@/components/EventThemeProvider";
import type { Metadata } from "next";
import { EVENT_SEO, registerMetadata } from "@/lib/seo";

export const metadata: Metadata = registerMetadata(EVENT_SEO["fun-bike"]);

export default function FunBikeDaftarPage() {
  return (
    <EventThemeProvider eventType="fun-bike">
      <main className="page-animate min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(180deg, #FFF8F0 0%, #FFFFFF 50%, #FFF7ED 100%)" }}>
        <EventNavbar
          brand={{ title: "Futuristic Bike", subtitle: "2026", href: "/fun-bike" }}
          navLinks={[{ label: "Kembali ke Info", href: "/fun-bike", isRoute: true }]}
          registerPath="/fun-bike/daftar"
          registerLabel="DAFTAR"
          theme="light"
          accentColor="#FF6B2C"
        />

        {/* BG glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl opacity-[0.08] bg-gradient-to-r from-[#FF6B2C] to-[#F59E0B]" />
        <div className="absolute top-1/3 -right-32 w-[350px] h-[350px] rounded-full blur-3xl opacity-[0.06] bg-[#F59E0B]" />
        <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.04] bg-[#7BC142]" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          <div className="section-reveal text-center mb-10">
            <div className="badge-sunrise inline-block mb-4">PENDAFTARAN ONLINE</div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>
              DAFTAR SEKARANG
            </h1>
            <p className="text-gray-500">Isi formulir berikut untuk bergabung di Futuristic Bike 2026</p>
          </div>
          <div className="section-reveal-delay-1">
            <RegistrationForm eventType="fun-bike" categoryLabel="Futuristic Bike Ride" defaultPrice={150000} />
          </div>
        </div>
      </main>
    </EventThemeProvider>
  );
}
