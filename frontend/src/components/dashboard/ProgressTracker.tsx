interface ProgressTrackerProps {
  overallProgress: number;
}

export default function ProgressTracker({ overallProgress }: ProgressTrackerProps) {
  const pct = Math.min(100, Math.max(0, overallProgress));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">Overall Progress</h3>
        <span className="text-sm font-bold text-blue-600">{pct.toFixed(0)}%</span>
      </div>
      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Average completion across all tracked tasks.
      </p>
    </div>
  );
}
