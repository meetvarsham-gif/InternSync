import type { Priority } from "@/types";
import { PRIORITY_BADGE_CLASSES } from "@/utils/constants";

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_BADGE_CLASSES[priority]}`}
    >
      {priority}
    </span>
  );
}
