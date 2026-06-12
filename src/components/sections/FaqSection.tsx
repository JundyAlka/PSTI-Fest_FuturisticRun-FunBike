"use client";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";

const faqs = [
  { q: "Apakah bisa mendaftar lebih dari satu kategori?", a: "Tidak, setiap peserta hanya bisa mendaftar untuk satu kategori lomba. Jika ingin mengikuti kategori berbeda, Anda perlu mendaftar dengan data yang berbeda." },
  { q: "Bagaimana cara membayar biaya pendaftaran?", a: "Tersedia 3 metode: Transfer bank, QRIS, atau melalui payment gateway Midtrans. Setelah transfer, upload bukti pembayaran di halaman konfirmasi. Pembayaran akan diverifikasi dalam 1×24 jam kerja." },
  { q: "Apakah jersey bisa ditukar ukurannya?", a: "Ukuran jersey dipilih saat pendaftaran dan tidak dapat ditukar setelah diverifikasi. Pastikan memilih ukuran yang tepat. Tersedia panduan ukuran di halaman pendaftaran." },
  { q: "Bagaimana jika saya tidak bisa hadir pada hari H?", a: "Biaya pendaftaran bersifat non-refundable. Race pack tetap bisa diambil sesuai jadwal meskipun tidak hadir pada hari H. BIB tidak dapat dipindahtangankan kepada orang lain." },
  { q: "Dimana titik start dan finish?", a: "Lokasi start dan finish akan diumumkan H-7 event melalui email, website, dan sosial media resmi PSTI FEST. Peserta akan mendapatkan peta rute lengkap saat pengambilan race pack." },
  { q: "Apakah ada fasilitas parkir?", a: "Panitia menyediakan area parkir terbatas di sekitar lokasi event. Disarankan menggunakan transportasi umum atau datang lebih awal untuk menghindari kepadatan." },
  { q: "Bagaimana cara cek nomor BIB saya?", a: "Nomor BIB akan diumumkan tanggal 17 Juni 2026 dan dapat dicek di website dengan memasukkan nomor registrasi atau email yang didaftarkan." },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-reveal relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#0F1535] to-[#0A0E27]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-reveal-delay-1 text-center mb-16">
          <div className="badge-neon inline-block mb-4">BANTUAN</div>
          <AnimatedSectionTitle text="FAQ" className="text-4xl sm:text-5xl font-black mb-4" />
          <p className="text-[#B0C4DE]">Pertanyaan yang sering ditanyakan</p>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#8B00FF] to-[#00E5FF] mt-4" />
        </div>

        <div className="stagger-list space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="card-animated glass-card rounded-xl border border-[#1E3A5F] overflow-hidden transition-all duration-300 hover:border-[#8B00FF]/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(139,0,255,0.1)", border: "1px solid rgba(139,0,255,0.2)" }}
                  >
                    <HelpCircle size={14} className="text-[#8B00FF]" />
                  </div>
                  <span className="text-white font-medium text-sm sm:text-base group-hover:text-[#00E5FF] transition-colors pr-4">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[#8B00FF] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className={`accordion-content ${openIndex === i ? "open" : ""}`}>
                <div className="px-5 pb-5">
                  <div className="pl-11 text-[#B0C4DE] text-sm leading-relaxed border-l-2 border-[#8B00FF]/30 ml-4">
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-reveal-delay-2 mt-10 text-center">
          <p className="text-[#B0C4DE] text-sm mb-3">Masih punya pertanyaan lain?</p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-neon inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm cursor-pointer"
          >
            💬 Hubungi Panitia via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
