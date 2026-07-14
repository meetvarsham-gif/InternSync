import { Link } from "react-router-dom";
import type { Task } from "@/types";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";
import { DEADLINE_TONE_CLASSES, formatDate, getDeadlineTone } from "@/utils/date";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const tone = getDeadlineTone(task.due_date, task.status);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/tasks/${task.id}`} className="font-semibold text-slate-900 hover:text-blue-600 line-clamp-2">
          {task.title}
        </Link>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            aria-label="Edit task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
            aria-label="Delete task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500 line-clamp-2">{task.description}</p>

      <div className="flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{task.category}</span>
      </div>

      <ProgressBar progress={task.progress} />

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${DEADLINE_TONE_CLASSES[tone]}`}>
          Due {formatDate(task.due_date)}
        </span>
        {task.estimated_hours != null && (
          <span className="text-xs text-slate-500">{task.estimated_hours}h estimated</span>
        )}
      </div>
    </div>
  );
}
