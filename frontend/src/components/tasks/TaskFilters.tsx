import { PRIORITIES, STATUSES } from "@/types";
import type { TaskFilters as TaskFiltersType } from "@/types";

interface TaskFiltersProps {
  filters: TaskFiltersType;
  categories: string[];
  onChange: (filters: Partial<TaskFiltersType>) => void;
  view: "table" | "card";
  onViewChange: (view: "table" | "card") => void;
}

export default function TaskFilters({ filters, categories, onChange, view, onViewChange }: TaskFiltersProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
      <div className="relative flex-1">
        <svg
          className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
        </svg>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search by title or description..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <select
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value as TaskFiltersType["status"] })}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={filters.priority}
        onChange={(e) => onChange({ priority: e.target.value as TaskFiltersType["priority"] })}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={filters.category}
        onChange={(e) => onChange({ category: e.target.value })}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={filters.sort_by}
        onChange={(e) => onChange({ sort_by: e.target.value as TaskFiltersType["sort_by"] })}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="due_date">Due Date</option>
        <option value="priority">Priority</option>
      </select>

      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 shrink-0">
        <button
          type="button"
          onClick={() => onViewChange("table")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            view === "table" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
          }`}
        >
          Table
        </button>
        <button
          type="button"
          onClick={() => onViewChange("card")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            view === "card" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
          }`}
        >
          Cards
        </button>
      </div>
    </div>
  );
}
