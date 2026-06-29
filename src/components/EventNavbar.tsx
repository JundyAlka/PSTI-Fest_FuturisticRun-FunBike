"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";

type NavLink = {
  label: string;
  href: string;
  isRoute?: boolean;
};

interface EventNavbarProps {
  brand: {
    title: string;
    subtitle: string;
    href?: string;
    logo?: React.ReactNode;
  };
  navLinks: NavLink[];
  registerPath: string;
  registerLabel?: string;
  theme?: "dark" | "light";
  accentColor?: string;
}

export default function EventNavbar({
  brand,
  navLinks,
  registerPath,
  registerLabel = "DAFTAR SEKARANG",
  theme = "dark",
  accentColor,
}: EventNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const accent = accentColor ?? (theme === "dark" ? "#00E5FF" : "#FF6B2C");
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-[#B0C4DE]" : "text-gray-600";
  const bgColor = theme === "dark" ? "rgba(10,14,39,0.95)" : "rgba(255,248,240,0.95)";
  const borderColor = theme === "dark" ? "rgba(0,229,255,0.2)" : "rgba(255,107,44,0.2)";
  const btnBg =
    theme === "dark"
      ? "linear-gradient(135deg, #2A4FFF, #8B00FF)"
      : "linear-gradient(135deg, #FF6B2C, #F59E0B)";
  const btnBorder = theme === "dark" ? "#00E5FF" : "#FF6B2C";
  const sectionIds = navLinks
    .filter((l) => !l.isRoute && l.href.startsWith("#"))
    .map((l) => l.href.replace("#", ""));

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      for (const s of [...sectionIds].reverse()) {
        const el = document.getElementById(s);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(s);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "border-b" : "bg-transparent border-b border-transparent"
        }`}
        style={
          scrolled
            ? { background: bgColor, backdropFilter: "blur(20px)", borderBottomColor: borderColor }
            : undefined
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Brand */}
            <Link
              href={brand.href ?? "/"}
              className="flex items-center gap-3 group"
            >
              {brand.logo}
              <div className="block min-w-0">
                <span
                  className={`block truncate font-black text-xs sm:text-sm tracking-widest ${textPrimary}`}
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  {brand.title}
                </span>
                <span
                  className={`text-[10px] sm:text-xs block tracking-[3px] sm:tracking-[4px] ${textSecondary}`}
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  {brand.subtitle}
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                if (link.isRoute) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-semibold px-4 py-1.5 rounded-full border transition-all duration-300"
                      style={{
                        borderColor: `${accent}66`,
                        color: accent,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-all duration-300 relative group ${
                      isActive ? textPrimary : `${textSecondary} hover:${textPrimary}`
                    }`}
                    style={{ fontFamily: "Inter, sans-serif", color: isActive ? accent : undefined }}
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-1 left-0 h-0.5 transition-all duration-300"
                      style={{
                        background: accent,
                        width: isActive ? "100%" : "0%",
                      }}
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href={registerPath}
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm text-white font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: btnBg,
                  border: `1px solid ${btnBorder}`,
                  fontFamily: "Orbitron, sans-serif",
                  letterSpacing: "1px",
                }}
              >
                <Zap size={14} />
                {registerLabel}
              </Link>
              <button
                className={`lg:hidden p-2 ${textPrimary}`}
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
        className={`fixed inset-y-0 right-0 w-72 z-50 origin-right border-l transition-all duration-300 ${
          menuOpen ? "scale-x-100 opacity-100" : "pointer-events-none scale-x-0 opacity-0"
        }`}
        style={{
          background: theme === "dark" ? "rgba(15,21,53,0.95)" : "#FFF8F0",
          backdropFilter: "blur(20px)",
          borderLeftColor: borderColor,
        }}
      >
        <div className="flex justify-end p-5">
          <button onClick={() => setMenuOpen(false)} className={textPrimary} aria-label="Tutup menu">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-2 px-6 py-4">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 px-4 rounded-lg transition-all duration-200 font-semibold text-center"
                style={{ color: accent, border: `1px solid ${accent}33` }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`${textSecondary} py-3 px-4 rounded-lg transition-all duration-200 font-medium`}
                style={{ ["--hover-color" as string]: accent }}
              >
                {link.label}
              </a>
            ),
          )}
          <Link
            href={registerPath}
            onClick={() => setMenuOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm text-white font-bold cursor-pointer"
            style={{ background: btnBg, fontFamily: "Orbitron, sans-serif", letterSpacing: "1px" }}
          >
            <Zap size={14} />
            {registerLabel}
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
