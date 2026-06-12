import type { Metadata } from "next";
import ScrollRevealProvider from "@/components/ScrollRevealProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "PSTI FEST 2026",
  icons: {
    icon: "/logo-futuristicrun.png",
    apple: "/logo-futuristicrun.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ScrollRevealProvider />
        {children}
      </body>
    </html>
  );
}
