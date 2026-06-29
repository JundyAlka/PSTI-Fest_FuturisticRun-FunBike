import type { Metadata } from "next";
import ScrollRevealProvider from "@/components/ScrollRevealProvider";
import { FEST_FULL_NAME } from "@/content/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: FEST_FULL_NAME,
  icons: {
    icon: "/logo-futuristicrun.png",
    apple: "/logo-futuristicrun.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
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
