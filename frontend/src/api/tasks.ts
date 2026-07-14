import { apiClient } from "./client";
import type { ActivityLog, Task, TaskFilters, TaskListResponse, TaskPayload, TaskStatus } from "@/types";

export async function fetchTasks(filters: Partial<TaskFilters> = {}): Promise<TaskListResponse> {
  const params: Record<string, string> = {};
  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.category) params.category = filters.category;
  if (filters.sort_by) params.sort_by = filters.sort_by;

  const { data } = await apiClient.get<TaskListResponse>("/tasks", { params });
  return data;
}

export async function fetchTask(id: number): Promise<Task> {
  const { data } = await apiClient.get<Task>(`/tasks/${id}`);
  return data;
}

export async function createTask(payload: TaskPayload): Promise<Task> {
  const { data } = await apiClient.post<Task>("/tasks", payload);
  return data;
}

export async function updateTask(id: number, payload: TaskPayload): Promise<Task> {
  const { data } = await apiClient.put<Task>(`/tasks/${id}`, payload);
  return data;
}

export async function patchTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const { data } = await apiClient.patch<Task>(`/tasks/${id}/status`, { status });
  return data;
}

export async function deleteTask(id: number): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}

export async function fetchTaskLogs(id: number): Promise<ActivityLog[]> {
  const { data } = await apiClient.get<ActivityLog[]>(`/tasks/${id}/logs`);
  return data;
}
