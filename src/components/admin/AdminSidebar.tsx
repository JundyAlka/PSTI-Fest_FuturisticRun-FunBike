"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Users, Settings, LogOut, Download } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import { FEST_NAME } from "@/content/brand";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/peserta", label: "Peserta", icon: Users },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  return (
    <aside
      className="slide-in-left flex w-full max-w-full shrink-0 flex-col border-b border-[#1E3A5F] md:min-h-screen md:w-64 md:border-b-0 md:border-r"
      style={{ background: "#080C20" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-[#1E3A5F] bg-[#080C20] p-4 md:p-6">
        <Link href="/admin" className="flex min-h-11 items-center gap-2">
          <LogoMark size={44} className="pulse-glow md:size-[51px]" />
          <div>
            <span className="text-xs font-black tracking-widest text-[#00E5FF] block" style={{ fontFamily: "Orbitron, sans-serif" }}>
              ADMIN
            </span>
            <span className="text-[10px] tracking-widest text-[#B0C4DE] block" style={{ fontFamily: "Orbitron, sans-serif" }}>
              {FEST_NAME}
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#FF006E] transition-colors duration-200 hover:bg-[#FF006E]/10 md:hidden"
          aria-label="Logout admin"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Nav */}
      <nav className="stagger-list flex max-w-full gap-2 overflow-x-auto p-3 md:flex-1 md:flex-col md:space-y-1 md:overflow-x-visible md:p-4">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`card-animated flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 md:gap-3 md:px-4 ${
                active
                  ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30"
                  : "text-[#B0C4DE] hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}

        {/* Export shortcut */}
        <a
          href="/api/admin/export"
          className="card-animated flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-3 text-sm font-medium text-[#B0C4DE] transition-all duration-200 hover:bg-white/5 hover:text-white md:gap-3 md:px-4"
        >
          <Download size={16} />
          Export Excel
        </a>
      </nav>

      {/* Sign out */}
      <div className="hidden border-t border-[#1E3A5F] p-4 md:block">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#FF006E] transition-colors duration-200 hover:bg-[#FF006E]/10"
          aria-label="Logout admin"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
