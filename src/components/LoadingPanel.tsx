type LoadingPanelProps = {
  label?: string;
};

export default function LoadingPanel({ label = "Memuat data" }: LoadingPanelProps) {
  return (
    <div className="loading-panel flex h-64 flex-col items-center justify-center gap-4 rounded-2xl">
      <div className="loading-orb" />
      <div
        className="relative z-10 text-xs font-bold tracking-[3px] text-[#00E5FF]"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        {label.toUpperCase()}...
      </div>
      <div className="relative z-10 w-48 space-y-2">
        <div className="skeleton-line" />
        <div className="skeleton-line mx-auto w-3/4" />
      </div>
    </div>
  );
}
