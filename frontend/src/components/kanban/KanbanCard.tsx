import { useDraggable } from "@dnd-kit/core";
import { Link } from "react-router-dom";
import type { Task } from "@/types";
import PriorityBadge from "@/components/tasks/PriorityBadge";
import ProgressBar from "@/components/tasks/ProgressBar";
import { DEADLINE_TONE_CLASSES, formatDate, getDeadlineTone } from "@/utils/date";

interface KanbanCardProps {
  task: Task;
}

export default function KanbanCard({ task }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const tone = getDeadlineTone(task.due_date, task.status);
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white border border-slate-200 rounded-lg p-3 space-y-2 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Link
        to={`/tasks/${task.id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-sm font-medium text-slate-800 hover:text-blue-600 line-clamp-2 block"
      >
        {task.title}
      </Link>
      <div className="flex items-center gap-2 flex-wrap">
        <PriorityBadge priority={task.priority} />
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${DEADLINE_TONE_CLASSES[tone]}`}>
          {formatDate(task.due_date)}
        </span>
      </div>
      <ProgressBar progress={task.progress} showLabel={false} size="sm" />
    </div>
  );
}
