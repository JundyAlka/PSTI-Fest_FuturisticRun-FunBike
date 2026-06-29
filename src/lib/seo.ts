import type { Metadata } from "next";
import { DEFAULT_SITE_URL, FEST_FULL_NAME, FEST_NAME, ORGANIZER_NAME } from "@/content/brand";
import { EVENTS } from "@/content/events";
import { eventStartIso } from "@/lib/eventDate";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
const SITE_NAME = FEST_FULL_NAME;

export interface EventSEO {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  eventDate: string | null;
  location: string | null;
  price: string | null;
  accentColor: string;
  ogImage?: string;
}

export const EVENT_SEO: Record<string, EventSEO> = {
  "futuristic-run": {
    slug: "futuristic-run",
    name: `${EVENTS["futuristic-run"].name} 2026`,
    tagline: EVENTS["futuristic-run"].tagline,
    description: `${EVENTS["futuristic-run"].hero.description} Bagian dari ${FEST_FULL_NAME}.`,
    eventDate: null,
    location: null,
    price: null,
    accentColor: EVENTS["futuristic-run"].accentColor,
    ogImage: `${SITE_URL}/og-futuristic-run.png`,
  },
  "fun-bike": {
    slug: "fun-bike",
    name: `${EVENTS["fun-bike"].name} 2026`,
    tagline: EVENTS["fun-bike"].tagline,
    description: `${EVENTS["fun-bike"].hero.description} Bagian dari ${FEST_FULL_NAME}.`,
    eventDate: null,
    location: null,
    price: null,
    accentColor: EVENTS["fun-bike"].accentColor,
    ogImage: `${SITE_URL}/og-fun-bike.png`,
  },
};

export function withOperationalEventSeo(
  base: EventSEO,
  eventDate: string | null,
  startTime: string,
  location: string | null
): EventSEO {
  return { ...base, eventDate: eventStartIso(eventDate, startTime), location };
}

export function eventMetadata(event: EventSEO): Metadata {
  const url = `${SITE_URL}/${event.slug}`;
  const title = `${event.name} - ${event.tagline} | ${FEST_NAME}`;

  return {
    title,
    description: event.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${event.name} - ${event.tagline}`,
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
      title: `${event.name} - ${event.tagline}`,
      description: event.description,
      images: event.ogImage ? [event.ogImage] : undefined,
    },
  };
}

export function registerMetadata(event: EventSEO): Metadata {
  const url = `${SITE_URL}/${event.slug}/daftar`;

  return {
    title: `Daftar ${event.name} - ${event.tagline} | ${FEST_NAME}`,
    description: `Daftarkan diri Anda untuk ${event.name}. ${event.description}`,
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

export function eventJsonLd(event: EventSEO) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: event.name,
    description: event.description,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: event.ogImage ? [event.ogImage] : [],
    organizer: {
      "@type": "Organization",
      name: ORGANIZER_NAME,
      url: SITE_URL,
    },
  };

  if (event.eventDate) {
    jsonLd.startDate = event.eventDate;
  }

  if (event.location) {
    jsonLd.location = {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.location,
        addressRegion: event.location,
        addressCountry: "ID",
      },
    };
  }

  if (event.price) {
    jsonLd.offers = {
      "@type": "Offer",
      price: event.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/${event.slug}/daftar`,
    };
  }

  return jsonLd;
}

export const hubMetadata: Metadata = {
  title: `${FEST_FULL_NAME} - Futuristic Run & Futuristic Bike`,
  description: `${FEST_FULL_NAME} menghadirkan Futuristic Run (alias Fun Run) dan Futuristic Bike (alias Fun Bike). Pilih eventmu dan daftarkan dirimu.`,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${FEST_FULL_NAME} - Futuristic Run & Futuristic Bike`,
    description: "Dua event, satu vibes: lari malam neon atau ride pagi sunrise.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "id_ID",
    images: [{ url: `${SITE_URL}/og-hub.png`, width: 1200, height: 630, alt: FEST_FULL_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${FEST_FULL_NAME} - Futuristic Run & Futuristic Bike`,
    description: "Dua event, satu vibes: lari malam neon atau ride pagi sunrise.",
    images: [`${SITE_URL}/og-hub.png`],
  },
};
