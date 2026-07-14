import type { Priority, TaskStatus } from "@/types";

export const PRIORITY_BADGE_CLASSES: Record<Priority, string> = {
  Low: "bg-slate-100 text-slate-600 border border-slate-200",
  Medium: "bg-amber-100 text-amber-700 border border-amber-200",
  High: "bg-red-100 text-red-700 border border-red-200",
};

export const STATUS_BADGE_CLASSES: Record<TaskStatus, string> = {
  Backlog: "bg-slate-100 text-slate-600 border border-slate-200",
  "To Do": "bg-blue-100 text-blue-700 border border-blue-200",
  "In Progress": "bg-amber-100 text-amber-700 border border-amber-200",
  Review: "bg-purple-100 text-purple-700 border border-purple-200",
  Completed: "bg-green-100 text-green-700 border border-green-200",
};

export const KANBAN_COLUMNS: TaskStatus[] = ["Backlog", "To Do", "In Progress", "Review", "Completed"];

export const CHART_COLORS: Record<TaskStatus, string> = {
  Backlog: "#94A3B8",
  "To Do": "#2563EB",
  "In Progress": "#F59E0B",
  Review: "#A855F7",
  Completed: "#22C55E",
};
