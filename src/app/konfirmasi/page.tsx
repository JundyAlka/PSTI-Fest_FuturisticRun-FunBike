import Navbar from "@/components/Navbar";
import ConfirmationContent from "@/components/ConfirmationContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendaftaran Berhasil — Futuristic RUN 2026",
};

export default function KonfirmasiPage() {
  return (
    <main className="page-animate min-h-screen bg-[#0A0E27] relative overflow-hidden">
      <Navbar />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-15 bg-gradient-to-r from-[#00E5FF] to-[#2A4FFF]" />
      <ConfirmationContent />
    </main>
  );
}
