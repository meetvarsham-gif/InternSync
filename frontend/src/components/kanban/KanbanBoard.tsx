import { useMemo } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { toast } from "react-toastify";
import { useTaskContext } from "@/context/TaskContext";
import { KANBAN_COLUMNS } from "@/utils/constants";
import type { TaskStatus } from "@/types";
import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard() {
  const { tasks, changeTaskStatus } = useTaskContext();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, typeof tasks> = {
      Backlog: [],
      "To Do": [],
      "In Progress": [],
      Review: [],
      Completed: [],
    };
    for (const task of tasks) {
      grouped[task.status].push(task);
    }
    return grouped;
  }, [tasks]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      await changeTaskStatus(taskId, newStatus);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update task status";
      toast.error(message);
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((status) => (
          <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} />
        ))}
      </div>
    </DndContext>
  );
}
