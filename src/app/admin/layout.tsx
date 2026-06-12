import { SessionProvider } from "next-auth/react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — PSTI FEST 2026",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="page-animate flex min-h-screen bg-[#0A0E27]">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
