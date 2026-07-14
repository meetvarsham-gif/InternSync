export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />;
}

export function SkeletonKpiCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <SkeletonBlock className="h-4 w-20" />
          <SkeletonBlock className="h-7 w-14" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTableRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="divide-y divide-slate-200">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <SkeletonBlock className="h-4 w-1/4" />
          <SkeletonBlock className="h-4 w-1/6" />
          <SkeletonBlock className="h-4 w-16" />
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-4 w-20" />
          <SkeletonBlock className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <SkeletonBlock className="h-5 w-3/4" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-2/3" />
          <SkeletonBlock className="h-2 w-full" />
          <div className="flex gap-2">
            <SkeletonBlock className="h-6 w-16" />
            <SkeletonBlock className="h-6 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonBlockGroup() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <SkeletonBlock className="h-4 w-32" />
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-2/3" />
    </div>
  );
}
