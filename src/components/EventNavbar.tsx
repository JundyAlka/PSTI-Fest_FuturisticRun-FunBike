"use client";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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
  const pathname = usePathname();
  const drawerId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
  const sectionIds = useMemo(
    () => navLinks.filter((l) => !l.isRoute && l.href.startsWith("#")).map((l) => l.href.slice(1)),
    [navLinks],
  );

  const closeMenu = useCallback(() => setMenuOpen(false), []);

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

  useEffect(() => {
    const frame = window.requestAnimationFrame(closeMenu);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const drawer = drawerRef.current;
    const focusables = drawer?.querySelectorAll<HTMLElement>(focusableSelector);
    focusables?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab" || !drawer) return;

      const items = Array.from(drawer.querySelectorAll<HTMLElement>(focusableSelector));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

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
                ref={menuButtonRef}
                className={`min-h-11 min-w-11 cursor-pointer p-2 lg:hidden ${textPrimary}`}
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
                aria-expanded={menuOpen}
                aria-controls={drawerId}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence onExitComplete={() => menuButtonRef.current?.focus()}>
        {menuOpen && (
          <>
            <motion.button
              key="mobile-menu-backdrop"
              type="button"
              aria-label="Tutup menu"
              className="fixed inset-0 z-[90] cursor-pointer bg-black/55 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, pointerEvents: "none" }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
            />
            <motion.div
              key="mobile-menu-panel"
              ref={drawerRef}
              id={drawerId}
              role="dialog"
              aria-modal="true"
              aria-label="Menu navigasi"
              className={`fixed inset-y-0 right-0 z-[100] w-72 border-l opacity-100 shadow-2xl backdrop-blur-xl ${
                theme === "dark" ? "bg-[#0E1530]" : "bg-[#FFFFFF]"
              }`}
              style={{ borderLeftColor: borderColor }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%", pointerEvents: "none" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="flex justify-end p-5">
                <button
                  type="button"
                  onClick={closeMenu}
                  className={`relative z-[110] flex min-h-11 min-w-11 cursor-pointer items-center justify-center ${textPrimary}`}
                  aria-label="Tutup menu"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col gap-2 px-6 py-4" aria-label="Navigasi mobile">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-4 py-3 text-center font-semibold transition-colors duration-200"
                style={{ color: accent, border: `1px solid ${accent}33` }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`${textSecondary} flex min-h-11 cursor-pointer items-center rounded-lg px-4 py-3 font-medium transition-colors duration-200`}
                style={{ ["--hover-color" as string]: accent }}
              >
                {link.label}
              </a>
            ),
          )}
          <Link
            href={registerPath}
            onClick={closeMenu}
            className="mt-4 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white"
            style={{ background: btnBg, fontFamily: "Orbitron, sans-serif", letterSpacing: "1px" }}
          >
            <Zap size={14} />
            {registerLabel}
          </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
