import Link from "next/link";
import { CalendarDays, Camera, Clock, Mail, MapPin, Phone, Play, Ticket } from "lucide-react";
import LogoMark from "@/components/LogoMark";

export default function Footer() {
  return (
    <footer className="section-reveal relative border-t border-[#1E3A5F] bg-[#080C20]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="stagger-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="card-animated lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <LogoMark size={63} className="pulse-glow" />
              <div>
                <span className="font-black text-sm tracking-widest text-[#00E5FF] block" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  FUTURISTIC
                </span>
                <span className="text-xs tracking-[3px] text-[#B0C4DE] block" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  RUN 2026
                </span>
              </div>
            </div>
            <p className="text-[#B0C4DE] text-sm leading-relaxed mb-4">
              Event lari futuristik 2026 oleh PSTI FEST dengan satu kategori utama: Run 5K.
            </p>
            <div className="flex items-center gap-1 text-sm text-[#B0C4DE]">
              <MapPin size={14} className="text-[#00E5FF]" />
              Purworejo, Jawa Tengah
            </div>
          </div>

          <div className="card-animated">
            <h4 className="text-white font-bold mb-4 text-sm tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
              NAVIGASI
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Beranda", href: "#hero" },
                { label: "Tentang Event", href: "#about" },
                { label: "Run 5K", href: "#categories" },
                { label: "Jersey Eksklusif", href: "#jersey" },
                { label: "Jadwal", href: "#timeline" },
                { label: "FAQ", href: "#faq" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[#B0C4DE] hover:text-[#00E5FF] text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-animated">
            <h4 className="text-white font-bold mb-4 text-sm tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
              EVENT
            </h4>
            <ul className="space-y-3 text-sm text-[#B0C4DE]">
              <li className="flex items-center gap-2">
                <CalendarDays size={14} className="text-[#00E5FF]" />
                22 Juni 2026
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-[#00E5FF]" />
                Start 05:00 WIB
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-[#00E5FF]" />
                Purworejo, Jawa Tengah
              </li>
              <li className="flex items-center gap-2 pt-2">
                <Ticket size={14} className="text-[#8B00FF]" />
                <span>
                  <span className="text-[#8B00FF] font-semibold">Run 5K</span> - Rp 200.000
                </span>
              </li>
            </ul>
          </div>

          <div className="card-animated">
            <h4 className="text-white font-bold mb-4 text-sm tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
              KONTAK
            </h4>
            <div className="space-y-3 mb-6">
              <a href="mailto:info@pstifest.com" className="flex items-center gap-2 text-[#B0C4DE] hover:text-[#00E5FF] text-sm transition-colors">
                <Mail size={14} className="text-[#00E5FF]" />
                info@pstifest.com
              </a>
              <a href="https://wa.me/6281234567890" className="flex items-center gap-2 text-[#B0C4DE] hover:text-[#00E5FF] text-sm transition-colors">
                <Phone size={14} className="text-[#00E5FF]" />
                +62 812-3456-7890
              </a>
            </div>

            <h4 className="text-white font-bold mb-3 text-sm tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
              IKUTI KAMI
            </h4>
            <div className="flex gap-3">
              {[
                { icon: Camera, href: "https://instagram.com/pstifest", label: "Instagram", color: "#FF006E" },
                { icon: Play, href: "https://youtube.com/@pstifest", label: "YouTube", color: "#FF8C00" },
                { icon: Phone, href: "https://wa.me/6281234567890", label: "WhatsApp", color: "#00E5FF" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl glass-card flex items-center justify-center border border-[#1E3A5F] hover:scale-110 transition-all duration-300"
                  style={{ color: social.color }}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1E3A5F] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#B0C4DE] text-xs">
            (c) 2026 <span className="text-[#00E5FF]">PSTI FEST</span> - Futuristic RUN. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/kebijakan-privasi" className="text-[#B0C4DE] hover:text-white text-xs transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/syarat-ketentuan" className="text-[#B0C4DE] hover:text-white text-xs transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
