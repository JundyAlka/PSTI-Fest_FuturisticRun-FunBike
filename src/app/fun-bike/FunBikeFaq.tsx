"use client";
import { useState } from "react";
import { ChevronDown, Shield, HelpCircle } from "lucide-react";

const items = [
  {
    type: "rule",
    title: "Syarat & Ketentuan Umum",
    content: "Peserta wajib mendaftarkan diri melalui website resmi. Pendaftaran dianggap sah setelah pembayaran terverifikasi. Peserta wajib membawa bukti pendaftaran dan helm pada hari H. Data yang telah diisi tidak dapat diubah setelah pendaftaran dikonfirmasi.",
  },
  {
    type: "rule",
    title: "Ketentuan Usia & Sepeda",
    content: "Fun Bike terbuka untuk semua usia. Peserta di bawah 12 tahun wajib didampingi orang dewasa. Semua jenis sepeda diperbolehkan: road bike, MTB, hybrid, folding, BMX, dan sepeda kota. Sepeda wajib dalam kondisi laik jalan.",
  },
  {
    type: "rule",
    title: "Prosedur Pengambilan Race Pack",
    content: "Race pack (jersey + goodie bag + nomor peserta) diambil pada 20–21 Juni 2026 di lokasi yang akan diinformasikan. Peserta wajib menunjukkan bukti registrasi. Race pack tidak dapat diwakilkan tanpa surat kuasa.",
  },
  {
    type: "rule",
    title: "Keselamatan & Helm",
    content: "Penggunaan helm WAJIB selama event. Peserta yang tidak memakai helm tidak akan diperbolehkan start. Disarankan menggunakan lampu depan dan belakang sepeda. Patuhi instruksi marshal di sepanjang rute.",
  },
  {
    type: "rule",
    title: "Disclaimer Kesehatan",
    content: "Peserta wajib dalam kondisi sehat. Peserta dengan kondisi medis tertentu dianjurkan berkonsultasi dengan dokter sebelum mendaftar. Panitia tidak bertanggung jawab atas cedera yang terjadi selama event.",
  },
  {
    type: "faq",
    title: "Apakah bisa mendaftar lebih dari satu event?",
    content: "Ya! Anda bisa mendaftar Fun Bike dan Futuristic RUN secara terpisah dengan data yang berbeda. Namun, satu orang hanya boleh mendaftar satu kali per event.",
  },
  {
    type: "faq",
    title: "Bagaimana cara membayar?",
    content: "Tersedia 2 metode: Transfer bank dan QRIS. Setelah mendaftar, ikuti instruksi pembayaran di halaman konfirmasi. Pembayaran akan diverifikasi dalam 1×24 jam kerja.",
  },
  {
    type: "faq",
    title: "Apakah jersey bisa ditukar ukurannya?",
    content: "Ukuran jersey dipilih saat pendaftaran dan tidak dapat ditukar. Pastikan memilih ukuran yang tepat berdasarkan size chart yang tersedia.",
  },
  {
    type: "faq",
    title: "Apakah ada fasilitas parkir?",
    content: "Panitia menyediakan area parkir sepeda dan kendaraan di sekitar lokasi start. Disarankan datang lebih awal.",
  },
  {
    type: "faq",
    title: "Apakah rute aman untuk pemula?",
    content: "Ya! Rute Fun Bike dirancang ramah pemula dengan medan yang relatif datar. Ada beberapa tanjakan ringan namun tidak memerlukan keahlian khusus.",
  },
];

export default function FunBikeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="stagger-list space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="card-animated glass-card-light rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-[#FF6B2C]/30"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: item.type === "rule" ? "rgba(255,107,44,0.1)" : "rgba(123,193,66,0.1)",
                  border: `1px solid ${item.type === "rule" ? "rgba(255,107,44,0.2)" : "rgba(123,193,66,0.2)"}`,
                }}
              >
                {item.type === "rule" ? (
                  <Shield size={14} className="text-[#FF6B2C]" />
                ) : (
                  <HelpCircle size={14} className="text-[#7BC142]" />
                )}
              </div>
              <span className="text-gray-900 font-medium text-sm sm:text-base group-hover:text-[#FF6B2C] transition-colors pr-4">
                {item.title}
              </span>
            </div>
            <ChevronDown
              size={18}
              className={`text-[#FF6B2C] flex-shrink-0 transition-transform duration-300 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>
          <div className={`accordion-content ${openIndex === i ? "open" : ""}`}>
            <div className="px-5 pb-5">
              <div
                className="pl-11 text-gray-600 text-sm leading-relaxed border-l-2 ml-4"
                style={{ borderColor: item.type === "rule" ? "rgba(255,107,44,0.3)" : "rgba(123,193,66,0.3)" }}
              >
                {item.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
