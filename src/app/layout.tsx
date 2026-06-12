import type { Metadata } from "next";
import ScrollRevealProvider from "@/components/ScrollRevealProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Futuristic RUN 2026 — Daftar Sekarang | PSTI FEST",
  description:
    "Futuristic RUN 2026 — Run The Future, Shine The Night. Event lari bertema futuristik oleh PSTI FEST dengan satu kategori Run 5K.",
  icons: {
    icon: "/logo-futuristicrun.png",
    apple: "/logo-futuristicrun.png",
  },
  openGraph: {
    title: "Futuristic RUN 2026 | PSTI FEST",
    description: "Run The Future, Shine The Night — Event lari futuristik terbesar 2026.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <ScrollRevealProvider />
        {children}
      </body>
    </html>
  );
}
