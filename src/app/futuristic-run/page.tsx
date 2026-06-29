import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import JerseySection from "@/components/sections/JerseySection";
import TimelineSection from "@/components/sections/TimelineSection";
import RunChampionsSection from "@/components/sections/RunChampionsSection";
import RacepackSection from "@/components/sections/RacepackSection";
import LocationSection from "@/components/sections/LocationSection";
import RulesSection from "@/components/sections/RulesSection";
import FaqSection from "@/components/sections/FaqSection";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import { EVENT_SEO, eventMetadata, eventJsonLd, withOperationalEventSeo } from "@/lib/seo";
import { getPublicEventOps } from "@/lib/eventOps";
import { EVENTS } from "@/content/events";
import { resolveEventLocation } from "@/lib/eventLocation";

const seo = EVENT_SEO["futuristic-run"];
const event = EVENTS["futuristic-run"];
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const ops = await getPublicEventOps("futuristic-run");
  const location = event.location ? resolveEventLocation(event.location, ops.settings).label : null;
  return eventMetadata(withOperationalEventSeo(seo, ops.eventDate, event.startTime, location));
}

export default async function FuturisticRunPage() {
  const ops = await getPublicEventOps("futuristic-run");
  const locationLabel = event.location ? resolveEventLocation(event.location, ops.settings).label : "";
  const operationalSeo = withOperationalEventSeo(seo, ops.eventDate, event.startTime, locationLabel || null);

  return (
    <>
    <main className="page-animate relative bg-[#0A0E27] min-h-screen">
      <ScrollProgressBar color="#00E5FF" />
      <Navbar />
      <HeroSection eventDate={ops.eventDate} locationLabel={locationLabel} />
      <AboutSection settings={ops.settings} quota={ops.quota} />
      <CategoriesSection price={ops.price} quota={ops.quota} categoryLabel={ops.categoryLabel} />
      <JerseySection />
      <RunChampionsSection settings={ops.settings} />
      <RacepackSection racepackLocation={ops.settings.racepack_location ?? "Kampus Plaosan"} />
      <LocationSection settings={ops.settings} />
      <TimelineSection eventDate={ops.eventDate} />
      <RulesSection settings={ops.settings} />
      <FaqSection settings={ops.settings} contactPerson={ops.contactPerson} />
      <Footer />
    </main>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(operationalSeo)) }}
    />
    </>
  );
}
