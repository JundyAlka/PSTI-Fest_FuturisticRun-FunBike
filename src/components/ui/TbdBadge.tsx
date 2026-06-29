import { HelpCircle } from "lucide-react";

export const TBD_LABEL = "Segera diumumkan";

export function hasAnnouncedValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return Number.isFinite(value) && value > 0;
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized.length > 0 && normalized !== "—" && normalized !== "-";
  }
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function valueOrTbd(value: unknown, fallback = TBD_LABEL): string {
  return hasAnnouncedValue(value) ? String(value) : fallback;
}

export default function TbdBadge({
  label = TBD_LABEL,
  microcopy,
  className = "",
}: {
  label?: string;
  microcopy?: string;
  className?: string;
}) {
  return (
    <span
      className={`tbd-badge relative inline-flex min-h-11 max-w-full items-center gap-2 overflow-hidden rounded-xl border border-[#8B00FF]/30 bg-[#8B00FF]/8 px-3 py-2 text-left text-[#D9C7FF] ${className}`}
    >
      <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#8B00FF]/15">
        <HelpCircle size={13} aria-hidden="true" />
      </span>
      <span className="relative z-10 min-w-0">
        <span className="block text-[0.68rem] font-bold uppercase tracking-[0.08em]">{label}</span>
        {microcopy ? <span className="mt-0.5 block text-[0.65rem] leading-snug text-[#B0C4DE]">{microcopy}</span> : null}
      </span>
    </span>
  );
}
