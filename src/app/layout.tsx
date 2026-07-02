import type { Metadata, Viewport } from "next";
import ScrollRevealProvider from "@/components/ScrollRevealProvider";
import VisitorTracker from "@/components/VisitorTracker";
import { FEST_FULL_NAME } from "@/content/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: FEST_FULL_NAME,
  description: `Official Website ${FEST_FULL_NAME}. Daftar dan bergabunglah di event Futuristic Run & Fun Bike.`,
  icons: {
    icon: "/logo-futuristicrun.png",
    apple: "/logo-futuristicrun.png",
  },
  openGraph: {
    title: FEST_FULL_NAME,
    description: `Official Website ${FEST_FULL_NAME}. Daftar dan bergabunglah di event Futuristic Run & Fun Bike.`,
    url: "https://futuristicvibes.id",
    siteName: FEST_FULL_NAME,
    images: [
      {
        url: "/logo-futuristicrun.png",
        width: 800,
        height: 800,
        alt: `Logo ${FEST_FULL_NAME}`,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: FEST_FULL_NAME,
    description: `Official Website ${FEST_FULL_NAME}. Daftar dan bergabunglah di event Futuristic Run & Fun Bike.`,
    images: ["/logo-futuristicrun.png"],
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
