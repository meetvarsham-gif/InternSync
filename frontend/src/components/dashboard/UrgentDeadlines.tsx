import { Link } from "react-router-dom";
import type { Task } from "@/types";
import { DEADLINE_TONE_CLASSES, formatDate, getDeadlineTone } from "@/utils/date";
import PriorityBadge from "@/components/tasks/PriorityBadge";

interface UrgentDeadlinesProps {
  tasks: Task[];
}

export default function UrgentDeadlines({ tasks }: UrgentDeadlinesProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Urgent Deadlines (Next 7 Days)</h3>
      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500">Nothing due soon. You're all caught up.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => {
            const tone = getDeadlineTone(task.due_date, task.status);
            return (
              <li key={task.id}>
                <Link
                  to={`/tasks/${task.id}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.category}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={task.priority} />
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${DEADLINE_TONE_CLASSES[tone]}`}
                    >
                      {formatDate(task.due_date)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
