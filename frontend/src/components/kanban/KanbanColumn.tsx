import { useDroppable } from "@dnd-kit/core";
import type { Task, TaskStatus } from "@/types";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

const COLUMN_ACCENTS: Record<TaskStatus, string> = {
  Backlog: "border-t-slate-400",
  "To Do": "border-t-blue-500",
  "In Progress": "border-t-amber-500",
  Review: "border-t-purple-500",
  Completed: "border-t-green-500",
};

export default function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-72 shrink-0 bg-slate-100/60 rounded-xl border-t-4 ${COLUMN_ACCENTS[status]} ${
        isOver ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-700">{status}</h3>
        <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 px-3 pb-3 space-y-2 min-h-[120px] overflow-y-auto">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
