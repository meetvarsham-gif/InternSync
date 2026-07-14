import type { TaskStatus } from "@/types";
import { STATUS_BADGE_CLASSES } from "@/utils/constants";

export default function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE_CLASSES[status]}`}
    >
      {status}
    </span>
  );
}
