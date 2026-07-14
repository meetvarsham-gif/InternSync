import { useState } from "react";
import Modal from "@/components/common/Modal";
import type { Task } from "@/types";

interface DeleteConfirmModalProps {
  task: Task | null;
  onClose: () => void;
  onConfirm: (task: Task) => Promise<void>;
}

export default function DeleteConfirmModal({ task, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!task) return null;

  async function handleConfirm() {
    if (!task) return;
    setDeleting(true);
    try {
      await onConfirm(task);
      onClose();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal open={Boolean(task)} onClose={onClose} title="Delete Task?" maxWidthClass="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-1.5a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </span>
          <div>
            <p className="text-sm text-slate-700">
              You're about to delete <span className="font-semibold">"{task.title}"</span>. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg shadow-sm transition-colors"
          >
            {deleting ? "Deleting..." : "Delete Task"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
