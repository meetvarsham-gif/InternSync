import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Modal from "@/components/common/Modal";
import { PRIORITIES, STATUSES } from "@/types";
import type { Task, TaskPayload } from "@/types";
import { todayIso } from "@/utils/date";

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: TaskPayload) => Promise<void>;
  initialTask?: Task | null;
}

type FormErrors = Partial<Record<keyof TaskPayload, string>>;

const EMPTY_FORM: TaskPayload = {
  title: "",
  description: "",
  category: "",
  priority: "Medium",
  status: "Backlog",
  progress: 0,
  due_date: todayIso(),
  estimated_hours: null,
  tags: "",
};

export default function TaskFormModal({ open, onClose, onSubmit, initialTask }: TaskFormModalProps) {
  const [form, setForm] = useState<TaskPayload>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(initialTask);

  useEffect(() => {
    if (!open) return;
    if (initialTask) {
      setForm({
        title: initialTask.title,
        description: initialTask.description,
        category: initialTask.category,
        priority: initialTask.priority,
        status: initialTask.status,
        progress: initialTask.progress,
        due_date: initialTask.due_date,
        estimated_hours: initialTask.estimated_hours,
        tags: initialTask.tags ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [open, initialTask]);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.title.trim()) next.title = "Title is required";
    else if (form.title.length > 100) next.title = "Title must be 100 characters or fewer";

    if (!form.description.trim()) next.description = "Description is required";
    else if (form.description.trim().length < 10) next.description = "Description must be at least 10 characters";

    if (!form.category.trim()) next.category = "Category is required";

    if (!form.due_date) next.due_date = "Due date is required";
    else if (!isEditing && form.due_date < todayIso()) next.due_date = "Due date must be today or later";

    if (form.estimated_hours != null && form.estimated_hours < 0) {
      next.estimated_hours = "Estimated hours cannot be negative";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleStatusChange(status: TaskPayload["status"]) {
    setForm((prev) => {
      if (status === "Completed") return { ...prev, status, progress: 100 };
      if (prev.status === "Completed" && prev.progress === 100) {
        return { ...prev, status, progress: 90 };
      }
      return { ...prev, status };
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        tags: form.tags?.trim() ? form.tags.trim() : null,
        estimated_hours: form.estimated_hours === null || Number.isNaN(form.estimated_hours) ? null : form.estimated_hours,
      });
      onClose();
    } catch {
      // Errors are surfaced globally via toast in the calling context.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Edit Task" : "Create Task"} maxWidthClass="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            type="text"
            maxLength={100}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPayload["priority"] })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskPayload["status"])}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.due_date && <p className="text-xs text-red-600 mt-1">{errors.due_date}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Hours (optional)</label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={form.estimated_hours ?? ""}
              onChange={(e) =>
                setForm({ ...form, estimated_hours: e.target.value === "" ? null : Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.estimated_hours && <p className="text-xs text-red-600 mt-1">{errors.estimated_hours}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated, optional)</label>
            <input
              type="text"
              value={form.tags ?? ""}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="frontend, urgent"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center justify-between text-sm font-medium text-slate-700 mb-1">
            <span>Progress</span>
            <span className="text-blue-600 font-semibold">{form.progress}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={form.progress}
            disabled={form.status === "Completed"}
            onChange={(e) =>
              setForm({ ...form, progress: Number(e.target.value) })
            }
            className="w-full accent-blue-600 disabled:opacity-50"
          />
          {form.status === "Completed" && (
            <p className="text-xs text-slate-500 mt-1">Progress is locked to 100% while status is Completed.</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg shadow-sm transition-colors"
          >
            {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
