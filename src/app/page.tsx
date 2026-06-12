import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import JerseySection from "@/components/sections/JerseySection";
import TimelineSection from "@/components/sections/TimelineSection";
import RulesSection from "@/components/sections/RulesSection";
import FaqSection from "@/components/sections/FaqSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="page-animate relative bg-[#0A0E27] min-h-screen">
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
  );
}
