import { Link } from "react-router-dom";
import type { ActivityLog } from "@/types";
import { formatDateTime } from "@/utils/date";

interface ActivityFeedProps {
  activity: ActivityLog[];
}

export default function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activity</h3>
      {activity.length === 0 ? (
        <p className="text-sm text-slate-500">No recent activity yet.</p>
      ) : (
        <ul className="space-y-4">
          {activity.map((log) => (
            <li key={log.id} className="flex gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/tasks/${log.task_id}`}
                  className="text-sm text-slate-800 hover:text-blue-600 font-medium"
                >
                  {log.action}
                </Link>
                <p className="text-xs text-slate-500">{formatDateTime(log.timestamp)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
