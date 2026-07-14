export type DeadlineTone = "overdue" | "today" | "upcoming";

function toDateOnly(value: string | Date): Date {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getDeadlineTone(dueDate: string, status?: string): DeadlineTone {
  if (status === "Completed") return "upcoming";
  const today = toDateOnly(new Date());
  const due = toDateOnly(dueDate);
  if (due.getTime() < today.getTime()) return "overdue";
  if (due.getTime() === today.getTime()) return "today";
  return "upcoming";
}

export const DEADLINE_TONE_CLASSES: Record<DeadlineTone, string> = {
  overdue: "text-red-600 bg-red-50 border-red-200",
  today: "text-amber-600 bg-amber-50 border-amber-200",
  upcoming: "text-green-600 bg-green-50 border-green-200",
};

export function formatDate(value: string): string {
  const d = new Date(value);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(value: string): string {
  const d = new Date(value);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function todayIso(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}
