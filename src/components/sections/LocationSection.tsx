import { MapPinned } from "lucide-react";
import AnimatedSectionTitle from "@/components/AnimatedSectionTitle";
import LocationMap from "@/components/ui/LocationMap";
import { EVENTS, type EventLocation } from "@/content/events";
import { resolveEventLocation } from "@/lib/eventLocation";

const event = EVENTS["futuristic-run"];

export default function LocationSection({ settings }: { settings: Record<string, string> }) {
  const location = resolveEventLocation(event.location as EventLocation, settings);
  return (
    <section id="location" className="section-reveal relative overflow-hidden py-10 sm:py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080C20] via-[#0C1230] to-[#080C20]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <div className="badge-neon mb-4 inline-flex items-center gap-2"><MapPinned size={14} /> LOKASI START & FINISH</div>
          <AnimatedSectionTitle text="TEMUKAN TITIK START" className="mb-4 text-4xl font-black sm:text-5xl" />
          <p className="mx-auto max-w-2xl text-sm leading-6 text-[#B0C4DE] sm:text-base">Pusat kegiatan Futuristic Run, mulai dari persiapan hingga garis finish.</p>
        </div>
        <LocationMap {...location} theme="run" />
      </div>
    </section>
  );
}
