"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Users, Settings, LogOut, Download } from "lucide-react";
import LogoMark from "@/components/LogoMark";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/peserta", label: "Peserta", icon: Users },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="slide-in-left w-64 min-h-screen flex flex-col border-r border-[#1E3A5F] flex-shrink-0"
      style={{ background: "#080C20" }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-[#1E3A5F]">
        <Link href="/admin" className="flex items-center gap-2">
          <LogoMark size={51} className="pulse-glow" />
          <div>
            <span className="text-xs font-black tracking-widest text-[#00E5FF] block" style={{ fontFamily: "Orbitron, sans-serif" }}>
              ADMIN
            </span>
            <span className="text-[10px] tracking-widest text-[#B0C4DE] block" style={{ fontFamily: "Orbitron, sans-serif" }}>
              PSTI FEST
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="stagger-list flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`card-animated flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
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
          className="card-animated flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#B0C4DE] hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <Download size={16} />
          Export CSV
        </a>
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-[#1E3A5F]">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#FF006E] hover:bg-[#FF006E]/10 transition-all duration-200"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
