import Navbar from "@/components/Navbar";
import ConfirmationContent from "@/components/ConfirmationContent";
import type { Metadata } from "next";
import { FEST_FULL_NAME } from "@/content/brand";

export const metadata: Metadata = {
  title: `Konfirmasi Pembayaran - ${FEST_FULL_NAME}`,
  description: `Konfirmasi pembayaran peserta ${FEST_FULL_NAME} menggunakan nomor registrasi yang valid.`,
};

export default function KonfirmasiPage() {
  return (
    <main className="page-animate min-h-screen bg-[#0A0E27] relative overflow-hidden">
      <Navbar />
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
  );
}
