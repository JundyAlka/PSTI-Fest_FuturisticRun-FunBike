import Navbar from "@/components/Navbar";
import ConfirmationContent from "@/components/ConfirmationContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendaftaran Berhasil — PSTI FEST 2026",
  description: "Konfirmasi pendaftaran Anda di PSTI FEST 2026. Upload bukti pembayaran dan selesaikan registrasi untuk Futuristic RUN atau Fun Bike.",
};

export default function KonfirmasiPage() {
  return (
    <ConfirmationWrapper />
  );
}

function ConfirmationWrapper() {
  return (
    <>
      {/* FuturisticRun theme (default) */}
      <main className="page-animate min-h-screen bg-[#0A0E27] relative overflow-hidden">
        <Navbar />
        {/* Enhanced BG effects */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(rgba(0,229,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-3xl opacity-[0.08] bg-gradient-to-r from-[#00E5FF] to-[#2A4FFF]" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.05] bg-[#8B00FF]" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.04] bg-[#00E5FF]" />
        <ConfirmationContent />
      </main>
    </>
  );
}
