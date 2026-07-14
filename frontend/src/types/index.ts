export type Priority = "Low" | "Medium" | "High";

export type TaskStatus = "Backlog" | "To Do" | "In Progress" | "Review" | "Completed";

export const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

export const STATUSES: TaskStatus[] = ["Backlog", "To Do", "In Progress", "Review", "Completed"];

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: TaskStatus;
  progress: number;
  due_date: string; // ISO date string (YYYY-MM-DD)
  estimated_hours: number | null;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskListResponse {
  total: number;
  items: Task[];
}

export interface TaskPayload {
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: TaskStatus;
  progress: number;
  due_date: string;
  estimated_hours: number | null;
  tags: string | null;
}

export interface ActivityLog {
  id: number;
  task_id: number;
  action: string;
  timestamp: string;
}

export interface DashboardStats {
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  overall_progress: number;
  recent_activity: ActivityLog[];
  urgent_deadlines: Task[];
  status_distribution: Record<string, number>;
  weekly_completions: { week: string; completed: number }[];
}

export interface TaskFilters {
  search: string;
  status: TaskStatus | "";
  priority: Priority | "";
  category: string;
  sort_by: "newest" | "oldest" | "due_date" | "priority";
}
