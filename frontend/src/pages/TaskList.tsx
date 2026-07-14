import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import TaskFiltersBar from "@/components/tasks/TaskFilters";
import TaskTable from "@/components/tasks/TaskTable";
import TaskCard from "@/components/tasks/TaskCard";
import TaskFormModal from "@/components/tasks/TaskFormModal";
import DeleteConfirmModal from "@/components/tasks/DeleteConfirmModal";
import EmptyState from "@/components/common/EmptyState";
import { SkeletonCardGrid, SkeletonTableRows } from "@/components/common/SkeletonLoader";
import { useTaskContext } from "@/context/TaskContext";
import type { Task, TaskPayload } from "@/types";

export default function TaskList() {
  const { tasks, loading, filters, setFilters, addTask, editTask, removeTask } = useTaskContext();
  const [view, setView] = useState<"table" | "card">("table");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.category))).sort(),
    [tasks]
  );

  function openCreateForm() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEditForm(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  async function handleSubmit(payload: TaskPayload) {
    if (editingTask) {
      await editTask(editingTask.id, payload);
    } else {
      await addTask(payload);
    }
  }

  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.priority || filters.category
  );

  function clearFilters() {
    setFilters({ search: "", status: "", priority: "", category: "" });
  }

  return (
    <div>
      <Header title="Tasks" subtitle="Manage every task in one place" onCreateTask={openCreateForm} />
      <div className="p-4 md:p-8 space-y-4">
        <TaskFiltersBar
          filters={filters}
          categories={categories}
          onChange={setFilters}
          view={view}
          onViewChange={setView}
        />

        {loading ? (
          view === "table" ? <SkeletonTableRows /> : <SkeletonCardGrid />
        ) : tasks.length === 0 ? (
          <EmptyState
            actionLabel={hasActiveFilters ? "Clear Filters" : "Create Task"}
            onAction={hasActiveFilters ? clearFilters : openCreateForm}
          />
        ) : view === "table" ? (
          <TaskTable tasks={tasks} onEdit={openEditForm} onDelete={setDeletingTask} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={openEditForm} onDelete={setDeletingTask} />
            ))}
          </div>
        )}
      </div>

      <TaskFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialTask={editingTask}
      />

      <DeleteConfirmModal
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={(task) => removeTask(task.id)}
      />
    </div>
  );
}
