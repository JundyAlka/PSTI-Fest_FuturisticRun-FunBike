import Link from "next/link";
import { CalendarDays, Camera, Clock, Mail, MapPin, Phone, Play, Ticket } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import { CONTACT_EMAIL, DEFAULT_CONTACT_NAME, DEFAULT_WHATSAPP, FEST_NAME, FEST_YEAR, ORGANIZER_NAME } from "@/content/brand";
import { EVENTS } from "@/content/events";
import { formatEventDate, formatWibTime } from "@/lib/eventDate";

export default function Footer({
  eventDate,
  locationLabel,
  settings = {},
  contactPerson,
}: {
  eventDate: string;
  locationLabel: string;
  settings?: Record<string, string>;
  contactPerson?: string | null;
}) {
  const contactName = settings.contact_person_name?.trim() || DEFAULT_CONTACT_NAME;
  const contactPhone = settings.contact_person_whatsapp?.trim() || contactPerson || settings.contact_person || DEFAULT_WHATSAPP;
  const whatsappNumber = contactPhone.replace(/\D/g, "");
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : `mailto:${CONTACT_EMAIL}`;

  return (
    <footer className="section-reveal relative border-t border-[#1E3A5F] bg-[#080C20]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="stagger-list grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-10">
          <div className="card-animated col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <LogoMark size={63} className="pulse-glow" />
              <div>
                <span className="font-black text-sm tracking-widest text-[#00E5FF] block" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  FUTURISTIC
                </span>
                <span className="text-xs tracking-[3px] text-[#B0C4DE] block" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  RUN {FEST_YEAR}
                </span>
              </div>
            </div>
            <p className="text-[#B0C4DE] text-sm leading-relaxed mb-4">
              {EVENTS["futuristic-run"].name} {FEST_YEAR} oleh {ORGANIZER_NAME} dengan tema neon night run.
            </p>
            <div className="flex items-center gap-1 text-sm text-[#B0C4DE]">
              <MapPin size={14} className="text-[#00E5FF]" />
              {locationLabel || "Alun-Alun Purworejo"}
            </div>
          </div>

          <div className="card-animated col-span-1">
            <h3 className="text-white font-bold mb-4 text-sm tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
              NAVIGASI
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Beranda", href: "#hero" },
                { label: "Tentang", href: "#about" },
                { label: "Run 5K", href: "#categories" },
                { label: "Jersey", href: "#jersey" },
                { label: "Jadwal", href: "#timeline" },
                { label: "FAQ", href: "#faq" },
                { label: "Cek Regis", href: "/cek" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#B0C4DE] hover:text-[#00E5FF] text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-animated col-span-1">
            <h3 className="text-white font-bold mb-4 text-sm tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
              EVENT
            </h3>
            <ul className="space-y-3 text-sm text-[#B0C4DE]">
              <li className="flex items-start gap-2">
                <CalendarDays size={14} className="text-[#00E5FF] mt-1 flex-shrink-0" />
                {formatEventDate(eventDate)}
              </li>
              <li className="flex items-start gap-2">
                <Clock size={14} className="text-[#00E5FF] mt-1 flex-shrink-0" />
                Mulai {formatWibTime(eventDate)} WIB
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-[#00E5FF] mt-1 flex-shrink-0" />
                {locationLabel || "Alun-Alun Purworejo"}
              </li>
              <li className="flex items-start gap-2 pt-1">
                <Ticket size={14} className="text-[#8B00FF] mt-1 flex-shrink-0" />
                <span>
                  <span className="text-[#8B00FF] font-semibold">Run 5K</span><br className="sm:hidden" /> - satu kategori
                </span>
              </li>
            </ul>
          </div>

          <div className="card-animated col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold mb-4 text-sm tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
              KONTAK
            </h3>
            <div className="space-y-3 mb-6">
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-[#B0C4DE] hover:text-[#00E5FF] text-sm transition-colors">
                <Mail size={14} className="text-[#00E5FF]" />
                {CONTACT_EMAIL}
              </a>
              <a href={whatsappHref} className="flex items-center gap-2 text-[#B0C4DE] hover:text-[#00E5FF] text-sm transition-colors">
                <Phone size={14} className="text-[#00E5FF]" />
                {contactPhone ? `${contactName}: ${contactPhone}` : "Hubungi panitia PSTI Fest"}
              </a>
            </div>

            <h3 className="text-white font-bold mb-3 text-sm tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
              IKUTI KAMI
            </h3>
            <div className="flex gap-3">
              {[
                { icon: Camera, href: "https://instagram.com/futuristicvibes", label: "Instagram", color: "#FF006E" },
                { icon: Play, href: "https://youtube.com/@futuristicvibes", label: "YouTube", color: "#FF8C00" },
                { icon: Phone, href: whatsappHref, label: "WhatsApp", color: "#00E5FF" },
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
            (c) {FEST_YEAR} <span className="text-[#00E5FF]">{FEST_NAME}</span> - {EVENTS["futuristic-run"].name}. All rights reserved.
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
