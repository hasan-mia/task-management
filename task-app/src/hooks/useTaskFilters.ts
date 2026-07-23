import { useDebouncedValue } from "./useDebouncedValue";
import { filterAndSortTasks, type TaskFilters } from "@/utils/taskFilters";
import type { TaskWithLocal } from "@/types/task";

export function useTaskFilters(
  tasks: TaskWithLocal[],
  filters: Omit<TaskFilters, "sortBy" | "sortOrder"> & {
    search: string;
    sortBy?: "dueDate" | "createdAt";
    sortOrder?: "ASC" | "DESC";
    dueDatePreset?: "all" | "today" | "thisWeek" | "overdue" | "next7Days";
  }
) {
  const debouncedSearch = useDebouncedValue(filters.search, 300);

  const result = typeof filterAndSortTasks === "function"
    ? filterAndSortTasks(tasks, {
        search: debouncedSearch,
        categoryId: filters.categoryId,
        status: filters.status as "open" | "done" | undefined,
        dueDatePreset: filters.dueDatePreset,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      })
    : [];

  return result;
}
