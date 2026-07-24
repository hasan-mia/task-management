import { useMemo, useCallback } from "react";
import { usePersistedTasksQuery } from "./usePersistedTasksQuery";

export function useTasks(filters?: { search?: string; categoryId?: string; status?: string }) {
  const base = usePersistedTasksQuery(filters);

  const refetch = useCallback(async () => {
    await base.refetch();
  }, [base.refetch]);

  return {
    tasks: base.tasks,
    isLoading: base.isLoading,
    isRefreshing: base.isRefreshing,
    isOffline: base.isOffline,
    lastRefreshedAt: base.lastRefreshedAt,
    error: base.error,
    createTask: base.createTask,
    updateTask: base.updateTask,
    setTaskStatus: base.setTaskStatus,
    deleteTask: base.deleteTask,
    toggleStarred: base.toggleStarred,
    refetch,
  };
}