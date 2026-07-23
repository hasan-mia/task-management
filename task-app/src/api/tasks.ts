import { apiClient } from "./client";
import type { Task, TaskWithLocal, StarredMap } from "@/types/task";
import { mergeTasksWithStarred } from "@/utils/mergeTasks";

const unwrap = <T>(res: { data: { data: T } }): T => res.data.data;

export async function fetchTasks(params: {
  search?: string;
  categoryId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<Task[]> {
  const res = await apiClient.get("/tasks", { params });
  return unwrap(res);
}

export async function fetchTaskById(id: string): Promise<Task> {
  const res = await apiClient.get(`/tasks/${id}`);
  return unwrap(res);
}

export async function createTask(payload: {
  title: string;
  description?: string;
  categoryId?: string;
  status?: string;
  dueDate?: string;
}): Promise<Task> {
  const res = await apiClient.post("/tasks", payload);
  return unwrap(res);
}

export async function updateTask(
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    categoryId: string;
    status: string;
    dueDate: string;
  }>
): Promise<Task> {
  const res = await apiClient.put(`/tasks/${id}`, payload);
  return unwrap(res);
}

export async function setTaskStatus(
  id: string,
  status: "open" | "done"
): Promise<Task> {
  const res = await apiClient.patch(`/tasks/${id}/status`, { status });
  return unwrap(res);
}

export async function deleteTask(id: string): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}

export async function fetchTasksMerged(freshTasks: Task[], starredMap: StarredMap): Promise<TaskWithLocal[]> {
  return mergeTasksWithStarred(freshTasks, starredMap);
}
