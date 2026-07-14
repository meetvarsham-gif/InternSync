import Header from "@/components/layout/Header";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import EmptyState from "@/components/common/EmptyState";
import { SkeletonCardGrid } from "@/components/common/SkeletonLoader";
import { useTaskContext } from "@/context/TaskContext";
import { useNavigate } from "react-router-dom";

export default function Kanban() {
  const { tasks, loading } = useTaskContext();
  const navigate = useNavigate();

  return (
    <div>
      <Header title="Kanban Board" subtitle="Drag tasks between columns to update their status" />
      <div className="p-4 md:p-8">
        {loading ? (
          <SkeletonCardGrid />
        ) : tasks.length === 0 ? (
          <EmptyState actionLabel="Create Task" onAction={() => navigate("/tasks")} />
        ) : (
          <KanbanBoard />
        )}
      </div>
    </div>
  );
}
