import type { Metadata, Viewport } from "next";
import ScrollRevealProvider from "@/components/ScrollRevealProvider";
import VisitorTracker from "@/components/VisitorTracker";
import { FEST_FULL_NAME } from "@/content/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: FEST_FULL_NAME,
  icons: {
    icon: "/logo-futuristicrun.png",
    apple: "/logo-futuristicrun.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
