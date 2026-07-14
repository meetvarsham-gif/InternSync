import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/layout/Header";
import PriorityBadge from "@/components/tasks/PriorityBadge";
import StatusBadge from "@/components/tasks/StatusBadge";
import ProgressBar from "@/components/tasks/ProgressBar";
import TaskFormModal from "@/components/tasks/TaskFormModal";
import DeleteConfirmModal from "@/components/tasks/DeleteConfirmModal";
import EmptyState from "@/components/common/EmptyState";
import { SkeletonBlockGroup } from "@/components/common/SkeletonLoader";
import { fetchTask, fetchTaskLogs } from "@/api/tasks";
import { useTaskContext } from "@/context/TaskContext";
import type { ActivityLog, Task, TaskPayload } from "@/types";
import { DEADLINE_TONE_CLASSES, formatDate, formatDateTime, getDeadlineTone } from "@/utils/date";

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { editTask, removeTask } = useTaskContext();

  const [task, setTask] = useState<Task | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const taskId = Number(id);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [taskData, logsData] = await Promise.all([fetchTask(taskId), fetchTaskLogs(taskId)]);
      setTask(taskData);
      setLogs(logsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load task";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (Number.isFinite(taskId)) load();
  }, [taskId, load]);

  async function handleSubmit(payload: TaskPayload) {
    await editTask(taskId, payload);
    await load();
  }

  async function handleDelete(t: Task) {
    await removeTask(t.id);
    navigate("/tasks");
  }

  if (loading) {
    return (
      <div>
        <Header title="Task Details" />
        <div className="p-4 md:p-8 space-y-6">
          <SkeletonBlockGroup />
          <SkeletonBlockGroup />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div>
        <Header title="Task Details" />
        <div className="p-4 md:p-8">
          <EmptyState
            title="Task Not Found"
            description="This task may have been deleted."
            actionLabel="Back to Tasks"
            onAction={() => navigate("/tasks")}
          />
        </div>
      </div>
    );
  }

  const tone = getDeadlineTone(task.due_date, task.status);
  const tags = task.tags
    ? task.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div>
      <Header title="Task Details" subtitle={task.title} />
      <div className="p-4 md:p-8 space-y-6">
        <Link to="/tasks" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Tasks
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{task.title}</h2>
                <p className="text-sm text-slate-500 mt-1">{task.category}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setFormOpen(true)}
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(task)}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${DEADLINE_TONE_CLASSES[tone]}`}>
                Due {formatDate(task.due_date)}
              </span>
              {task.estimated_hours != null && (
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {task.estimated_hours}h estimated
                </span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-1">Description</h3>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{task.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Progress</h3>
              <ProgressBar progress={task.progress} />
            </div>

            {tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <span>Created: {formatDateTime(task.created_at)}</span>
              <span>Last Updated: {formatDateTime(task.updated_at)}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Activity Timeline</h3>
            {logs.length === 0 ? (
              <p className="text-sm text-slate-500">No activity recorded yet.</p>
            ) : (
              <ol className="relative border-l border-slate-200 ml-2 space-y-6">
                {logs.map((log) => (
                  <li key={log.id} className="ml-4">
                    <span className="absolute -left-1.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
                    <p className="text-sm font-medium text-slate-800">{log.action}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(log.timestamp)}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>

      <TaskFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initialTask={task} />
      <DeleteConfirmModal task={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
}
