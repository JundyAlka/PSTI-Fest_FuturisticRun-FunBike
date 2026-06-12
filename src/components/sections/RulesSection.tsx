"use client";
import { useState } from "react";
import { ChevronDown, Shield } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";

const rules = [
  {
    title: "Syarat & Ketentuan Umum",
    content: "Peserta wajib mendaftarkan diri melalui website resmi. Pendaftaran dianggap sah setelah pembayaran terverifikasi oleh panitia. Peserta wajib membawa bukti pendaftaran pada hari H. Data yang telah diisi tidak dapat diubah setelah pendaftaran dikonfirmasi.",
  },
  {
    title: "Ketentuan Usia Peserta",
    content: "Run 5K terbuka untuk peserta minimal usia 13 tahun. Peserta di bawah 17 tahun wajib melampirkan izin orang tua atau wali.",
  },
  {
    title: "Prosedur Pengambilan Race Pack",
    content: "Race pack (jersey + BIB + perlengkapan) diambil pada tanggal 20–21 Juni 2026 di lokasi yang akan diinformasikan. Peserta wajib menunjukkan bukti registrasi. Race pack tidak dapat diwakilkan kecuali dengan surat kuasa. Race pack yang tidak diambil tidak dapat diklaim kembali.",
  },
  {
    title: "Larangan & Sanksi",
    content: "Dilarang menggunakan kendaraan bermotor selama perlombaan. Dilarang menggunakan doping atau substansi terlarang. Peserta yang melanggar peraturan akan didiskualifikasi tanpa pengembalian biaya. Panitia berhak membatalkan pendaftaran jika ditemukan kecurangan.",
  },
  {
    title: "Disclaimer Kesehatan & Risiko",
    content: "Peserta wajib dalam kondisi sehat pada saat perlombaan. Peserta dengan kondisi medis tertentu dianjurkan berkonsultasi dengan dokter sebelum mendaftar. Panitia tidak bertanggung jawab atas cedera atau kondisi medis yang terjadi selama event. Disarankan membawa kartu asuransi kesehatan.",
  },
  {
    title: "Kebijakan Refund",
    content: "Biaya pendaftaran tidak dapat dikembalikan (non-refundable) setelah verifikasi pembayaran. Tidak ada transferabilitas nomor BIB antar peserta. Jika event dibatalkan oleh panitia, akan ada pengembalian biaya sesuai kebijakan yang akan diinformasikan.",
  },
];

export default function RulesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="rules" className="section-reveal relative py-24 overflow-hidden bg-[#0A0E27]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-reveal-delay-1 text-center mb-16">
          <div className="badge-neon inline-block mb-4">KETENTUAN</div>
          <AnimatedSectionTitle text="PERATURAN" className="text-4xl sm:text-5xl font-black mb-4" />
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF006E]" />
        </div>

        <div className="stagger-list space-y-3">
          {rules.map((rule, i) => (
            <div
              key={i}
              className="card-animated glass-card rounded-xl border border-[#1E3A5F] overflow-hidden transition-all duration-300 hover:border-[#00E5FF]/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.2)" }}
                  >
                    <Shield size={14} className="text-[#00E5FF]" />
                  </div>
                  <span className="text-white font-semibold text-sm sm:text-base group-hover:text-[#00E5FF] transition-colors">
                    {rule.title}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[#00E5FF] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className={`accordion-content ${openIndex === i ? "open" : ""}`}>
                <div className="px-5 pb-5">
                  <div className="pl-11 text-[#B0C4DE] text-sm leading-relaxed border-l-2 border-[#00E5FF]/30 ml-4">
                    {rule.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
