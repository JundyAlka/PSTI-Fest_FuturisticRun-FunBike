import type { Benefit } from "@/content/events";
import BenefitCard from "./BenefitCard";

export default function BenefitGrid({ benefits }: { benefits: Benefit[] }) {
  return (
    <div className="stagger-list grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Benefit peserta Futuristic Run">
      {benefits.map((benefit) => <BenefitCard key={benefit.id} benefit={benefit} />)}
    </div>
  );
}
