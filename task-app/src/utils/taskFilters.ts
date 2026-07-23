import type { TaskWithLocal } from "@/types/task";

export type SortField = "dueDate" | "createdAt";
export type SortOrder = "ASC" | "DESC";

export interface TaskFilters {
  search?: string;
  categoryId?: string;
  status?: "open" | "done";
  sortBy?: SortField;
  sortOrder?: SortOrder;
  dueDatePreset?: "today" | "thisWeek" | "overdue" | "next7Days";
}

function matchesSearch(task: TaskWithLocal, search?: string): boolean {
  if (!search || search.trim() === "") return true;
  const q = search.toLowerCase().trim();
  return (
    task.title.toLowerCase().includes(q) ||
    (task.description?.toLowerCase().includes(q) ?? false)
  );
}

function matchesCategory(task: TaskWithLocal, categoryId?: string): boolean {
  if (!categoryId) return true;
  return task.categoryId === categoryId;
}

function matchesStatus(task: TaskWithLocal, status?: "open" | "done"): boolean {
  if (!status) return true;
  return task.status === status;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day + 6) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfWeek(d: Date): Date {
  const date = startOfWeek(d);
  date.setDate(date.getDate() + 6);
  date.setHours(23, 59, 59, 999);
  return date;
}

function matchesDueDatePreset(task: TaskWithLocal, preset?: TaskFilters["dueDatePreset"]): boolean {
  if (!preset || !task.dueDate) return true;
  const due = new Date(task.dueDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (preset === "today") {
    return isSameDay(due, today);
  }

  if (preset === "thisWeek") {
    return due >= startOfWeek(today) && due <= endOfWeek(today);
  }

  if (preset === "overdue") {
    return due < today && task.status !== "done";
  }

  if (preset === "next7Days") {
    const next7 = new Date(today);
    next7.setDate(next7.getDate() + 7);
    next7.setHours(23, 59, 59, 999);
    return due >= today && due <= next7;
  }

  return true;
}

function sortTasks(tasks: TaskWithLocal[], sortBy?: SortField, sortOrder?: SortOrder): TaskWithLocal[] {
  if (!sortBy) return tasks;

  const sorted = [...tasks];
  const order = sortOrder === "DESC" ? -1 : 1;

  sorted.sort((a, b) => {
    let valA: string | number;
    let valB: string | number;

    if (sortBy === "dueDate") {
      valA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      valB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
    } else {
      valA = new Date(a.createdAt).getTime();
      valB = new Date(b.createdAt).getTime();
    }

    if (valA < valB) return -1 * order;
    if (valA > valB) return 1 * order;
    return 0;
  });

  return sorted;
}

export function filterAndSortTasks(tasks: TaskWithLocal[], filters: TaskFilters): TaskWithLocal[] {
  let result = tasks.filter((t) => matchesSearch(t, filters.search));
  result = result.filter((t) => matchesCategory(t, filters.categoryId));
  result = result.filter((t) => matchesStatus(t, filters.status));
  result = result.filter((t) => matchesDueDatePreset(t, filters.dueDatePreset));
  return sortTasks(result, filters.sortBy, filters.sortOrder);
}
