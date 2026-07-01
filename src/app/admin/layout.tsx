import { SessionProvider } from "next-auth/react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { Metadata } from "next";
import { FEST_FULL_NAME } from "@/content/brand";

export const metadata: Metadata = {
  title: `Admin Dashboard - ${FEST_FULL_NAME}`,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="page-animate flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-[#0A0E27] md:flex-row">
        <AdminSidebar />
        <main className="min-w-0 max-w-full flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
