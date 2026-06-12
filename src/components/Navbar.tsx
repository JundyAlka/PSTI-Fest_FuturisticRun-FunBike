"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import LogoMark from "@/components/LogoMark";

const navLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Tentang", href: "#about" },
  { label: "Kategori", href: "#categories" },
  { label: "Jersey", href: "#jersey" },
  { label: "Jadwal", href: "#timeline" },
  { label: "FAQ", href: "#faq" },
  { label: "Pendaftaran", href: "/daftar", isRoute: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      // detect active section
      const sections = ["hero", "about", "categories", "jersey", "timeline", "rules", "faq"];
      for (const s of sections.reverse()) {
        const el = document.getElementById(s);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(s);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "navbar-scrolled" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.assign("/");
              }}
              className="flex items-center gap-3 group"
              aria-label="Kembali ke beranda"
            >
              <LogoMark size={60} priority className="pulse-glow" />
              <div className="hidden sm:block">
                <span
                  className="font-black text-sm tracking-widest glow-cyan-text"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  FUTURISTIC
                </span>
                <span
                  className="text-xs block tracking-[4px] text-[#B0C4DE]"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  RUN 2026
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="stagger-list hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                if (link.isRoute) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-semibold px-4 py-1.5 rounded-full border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-all duration-300"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`card-animated text-sm font-medium transition-all duration-300 relative group ${
                      isActive ? "text-[#00E5FF]" : "text-[#B0C4DE] hover:text-white"
                    }`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-[#00E5FF] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </a>
                );
              })}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="/daftar"
                className="btn-neon hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm cursor-pointer"
              >
                <Zap size={14} />
                DAFTAR SEKARANG
              </Link>
              <button
                className="md:hidden text-white p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`mobile-menu fixed inset-y-0 right-0 w-72 z-50 glass-card border-l border-[#00E5FF]/20 ${
          menuOpen ? "open" : ""
        }`}
      >
        <div className="flex justify-end p-5">
          <button onClick={() => setMenuOpen(false)} className="text-white">
            <X size={24} />
          </button>
        </div>
        <div className="stagger-list flex flex-col gap-2 px-6 py-4">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="card-animated text-[#00E5FF] border border-[#00E5FF]/30 py-3 px-4 rounded-lg hover:bg-[#00E5FF]/10 transition-all duration-200 font-semibold text-center"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="card-animated text-[#B0C4DE] hover:text-[#00E5FF] py-3 px-4 rounded-lg hover:bg-[#00E5FF]/10 transition-all duration-200 font-medium"
              >
                {link.label}
              </a>
            )
          )}
          <Link
            href="/daftar"
            onClick={() => setMenuOpen(false)}
            className="btn-neon mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm cursor-pointer"
          >
            <Zap size={14} />
            DAFTAR SEKARANG
          </Link>
        </div>
      </div>
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
