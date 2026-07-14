import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "react-toastify";
import * as tasksApi from "@/api/tasks";
import type { Task, TaskFilters, TaskPayload, TaskStatus } from "@/types";

interface TaskContextValue {
  tasks: Task[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
  setFilters: (filters: Partial<TaskFilters>) => void;
  refetch: () => Promise<void>;
  addTask: (payload: TaskPayload) => Promise<Task>;
  editTask: (id: number, payload: TaskPayload) => Promise<Task>;
  changeTaskStatus: (id: number, status: TaskStatus) => Promise<Task>;
  removeTask: (id: number) => Promise<void>;
}

const DEFAULT_FILTERS: TaskFilters = {
  search: "",
  status: "",
  priority: "",
  category: "",
  sort_by: "newest",
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<TaskFilters>(DEFAULT_FILTERS);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.fetchTasks(filters);
      setTasks(data.items);
      setTotal(data.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load tasks";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const setFilters = useCallback((partial: Partial<TaskFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
  }, []);

  const addTask = useCallback(
    async (payload: TaskPayload) => {
      const created = await tasksApi.createTask(payload);
      toast.success(`Task "${created.title}" created`);
      await refetch();
      return created;
    },
    [refetch]
  );

  const editTask = useCallback(
    async (id: number, payload: TaskPayload) => {
      const updated = await tasksApi.updateTask(id, payload);
      toast.success(`Task "${updated.title}" updated`);
      await refetch();
      return updated;
    },
    [refetch]
  );

  const changeTaskStatus = useCallback(
    async (id: number, status: TaskStatus) => {
      const updated = await tasksApi.patchTaskStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success(`Moved "${updated.title}" to ${status}`);
      return updated;
    },
    []
  );

  const removeTask = useCallback(
    async (id: number) => {
      await tasksApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success("Task deleted");
    },
    []
  );

  const value = useMemo(
    () => ({
      tasks,
      total,
      loading,
      error,
      filters,
      setFilters,
      refetch,
      addTask,
      editTask,
      changeTaskStatus,
      removeTask,
    }),
    [tasks, total, loading, error, filters, setFilters, refetch, addTask, editTask, changeTaskStatus, removeTask]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return ctx;
}
