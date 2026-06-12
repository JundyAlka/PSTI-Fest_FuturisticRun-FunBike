import RegistrationForm from "@/components/forms/RegistrationForm";
import Navbar from "@/components/Navbar";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Sekarang — Futuristic RUN 2026 | PSTI FEST",
  description: "Daftarkan diri Anda untuk Futuristic RUN 2026 kategori Run 5K dan dapatkan jersey eksklusif.",
};

export default function DaftarPage() {
  return (
    <main className="page-animate min-h-screen bg-[#0A0E27] relative overflow-hidden">
      <Navbar />
      {/* BG effects */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-[#2A4FFF] to-[#8B00FF]" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="section-reveal text-center mb-10">
          <div className="badge-neon inline-block mb-4">PENDAFTARAN ONLINE</div>
          <AnimatedSectionTitle text="DAFTAR SEKARANG" level={1} className="text-4xl sm:text-5xl font-black mb-3" />
          <p className="text-[#B0C4DE]">Isi formulir berikut untuk bergabung di Futuristic RUN 2026</p>
        </div>
        <div className="section-reveal-delay-1">
          <RegistrationForm />
        </div>
      </div>
    </main>
  );
}
