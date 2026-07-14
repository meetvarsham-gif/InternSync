interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}

function barColor(progress: number): string {
  if (progress >= 100) return "bg-green-500";
  if (progress >= 50) return "bg-blue-600";
  if (progress > 0) return "bg-amber-500";
  return "bg-slate-300";
}

export default function ProgressBar({ progress, showLabel = true, size = "md" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className="w-full">
      <div className={`w-full ${height} bg-slate-100 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${barColor(clamped)} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-slate-500 mt-1 inline-block">{clamped}%</span>}
    </div>
  );
}
