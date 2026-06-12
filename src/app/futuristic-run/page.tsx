import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import JerseySection from "@/components/sections/JerseySection";
import TimelineSection from "@/components/sections/TimelineSection";
import RulesSection from "@/components/sections/RulesSection";
import FaqSection from "@/components/sections/FaqSection";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import { EVENT_SEO, eventMetadata, eventJsonLd } from "@/lib/seo";

const seo = EVENT_SEO["futuristic-run"];
export const metadata: Metadata = eventMetadata(seo);

export default function FuturisticRunPage() {
  return (
    <>
    <main className="page-animate relative bg-[#0A0E27] min-h-screen">
      <ScrollProgressBar color="#00E5FF" />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <CategoriesSection />
      <JerseySection />
      <TimelineSection />
      <RulesSection />
      <FaqSection />
      <Footer />
    </main>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(seo)) }}
    />
    </>
  );
}
