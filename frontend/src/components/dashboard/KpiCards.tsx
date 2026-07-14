import type { DashboardStats } from "@/types";

interface KpiCardsProps {
  stats: DashboardStats;
}

const CARD_CONFIG = [
  {
    key: "total_tasks" as const,
    label: "Total Tasks",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    accent: "text-slate-900 bg-slate-100",
  },
  {
    key: "completed_tasks" as const,
    label: "Completed",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    accent: "text-green-600 bg-green-50",
  },
  {
    key: "in_progress_tasks" as const,
    label: "In Progress",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    accent: "text-amber-600 bg-amber-50",
  },
  {
    key: "pending_tasks" as const,
    label: "Pending",
    icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
    accent: "text-blue-600 bg-blue-50",
  },
  {
    key: "overdue_tasks" as const,
    label: "Overdue",
    icon: "M12 9v3.75m9-1.5a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
    accent: "text-red-600 bg-red-50",
  },
];

export default function KpiCards({ stats }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {CARD_CONFIG.map((card) => (
        <div
          key={card.key}
          className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">{card.label}</span>
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.accent}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
              </svg>
            </span>
          </div>
          <span className="text-2xl font-bold text-slate-900">{stats[card.key]}</span>
        </div>
      ))}
    </div>
  );
}
