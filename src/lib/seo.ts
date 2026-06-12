import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pstifest.com";
const SITE_NAME = "PSTI FEST 2026";

export interface EventSEO {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  eventDate: string;
  location: string;
  price: string;
  accentColor: string;
  ogImage?: string;
}

export const EVENT_SEO: Record<string, EventSEO> = {
  "futuristic-run": {
    slug: "futuristic-run",
    name: "Futuristic RUN 2026",
    tagline: "Run The Future, Shine The Night",
    description:
      "Event lari malam bertema cyberpunk dari PSTI FEST 2026. Kategori Run 5K dengan jersey eksklusif, BIB name, dan atmosfer neon yang memukau.",
    eventDate: "2026-06-22T19:00:00+07:00",
    location: "Purworejo, Jawa Tengah",
    price: "200000",
    accentColor: "#00E5FF",
    ogImage: `${SITE_URL}/og-futuristic-run.png`,
  },
  "fun-bike": {
    slug: "fun-bike",
    name: "Fun Bike 2026",
    tagline: "Ride The Sunrise",
    description:
      "Gowes santai menyambut matahari terbit di Purworejo dari PSTI FEST 2026. Satu paket seru untuk semua level pesepeda!",
    eventDate: "2026-06-22T05:00:00+07:00",
    location: "Purworejo, Jawa Tengah",
    price: "150000",
    accentColor: "#FF6B2C",
    ogImage: `${SITE_URL}/og-fun-bike.png`,
  },
};

/** Generate full Metadata for an event landing page */
export function eventMetadata(event: EventSEO): Metadata {
  const url = `${SITE_URL}/${event.slug}`;
  return {
    title: `${event.name} — ${event.tagline} | PSTI FEST`,
    description: event.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${event.name} — ${event.tagline}`,
      description: event.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "id_ID",
      images: event.ogImage
        ? [{ url: event.ogImage, width: 1200, height: 630, alt: event.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.name} — ${event.tagline}`,
      description: event.description,
      images: event.ogImage ? [event.ogImage] : undefined,
    },
  };
}

/** Generate full Metadata for a registration page */
export function registerMetadata(event: EventSEO): Metadata {
  const url = `${SITE_URL}/${event.slug}/daftar`;
  return {
    title: `Daftar ${event.name} — ${event.tagline} | PSTI FEST`,
    description: `Daftarkan diri Anda untuk ${event.name} dan dapatkan jersey eksklusif. ${event.description}`,
    alternates: { canonical: url },
    openGraph: {
      title: `Daftar ${event.name}`,
      description: event.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "id_ID",
      images: event.ogImage
        ? [{ url: event.ogImage, width: 1200, height: 630, alt: `Daftar ${event.name}` }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `Daftar ${event.name}`,
      description: event.description,
      images: event.ogImage ? [event.ogImage] : undefined,
    },
  };
}

/** Generate JSON-LD Event schema */
export function eventJsonLd(event: EventSEO) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: event.name,
    description: event.description,
    startDate: event.eventDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Purworejo",
        addressRegion: "Jawa Tengah",
        addressCountry: "ID",
      },
    },
    image: event.ogImage ? [event.ogImage] : [],
    organizer: {
      "@type": "Organization",
      name: "Himatekno UMPWR",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: event.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/${event.slug}/daftar`,
    },
  };
}

/** Hub page metadata */
export const hubMetadata: Metadata = {
  title: "PSTI FEST 2026 — Futuristic Run & Fun Bike",
  description:
    "PSTI FEST 2026 menghadirkan dua event seru: Futuristic RUN (lari malam neon 5K) dan Fun Bike (gowes sunrise). Daftarkan dirimu sekarang!",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "PSTI FEST 2026 — Futuristic Run & Fun Bike",
    description: "Dua event, satu festival. Run The Future atau Ride The Sunrise!",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "id_ID",
    images: [{ url: `${SITE_URL}/og-hub.png`, width: 1200, height: 630, alt: "PSTI FEST 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PSTI FEST 2026 — Futuristic Run & Fun Bike",
    description: "Dua event, satu festival. Run The Future atau Ride The Sunrise!",
    images: [`${SITE_URL}/og-hub.png`],
  },
};
