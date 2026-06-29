import Image from "next/image";

interface LogoMarkProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export default function LogoMark({ size = 40, className = "", priority = false }: LogoMarkProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full border border-[#00E5FF]/40 bg-[#050816] shadow-[0_0_22px_rgba(0,229,255,0.35)] ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-futuristicrun.png"
        alt="Futuristic Run logo"
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority={priority}
      />
    </span>
  );
}
