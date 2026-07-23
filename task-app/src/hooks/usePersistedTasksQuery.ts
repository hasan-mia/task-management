import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, fetchTaskById, createTask as apiCreateTask, updateTask as apiUpdateTask, setTaskStatus as apiSetTaskStatus, deleteTask as apiDeleteTask } from "@/api/tasks";
import { getCachedTasks, setCachedTasks, getStarredMap, getLastRefreshedAt, setLastRefreshedAt } from "@/utils/mergeTasks";
import type { Task, TaskWithLocal, StarredMap } from "@/types/task";
import NetInfo from "@react-native-community/netinfo";

export interface UseTasksOptions {
  search?: string;
  categoryId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function usePersistedTasksQuery(options: UseTasksOptions = {}) {
  const queryClient = useQueryClient();
  const [initialData, setInitialData] = useState<TaskWithLocal[] | undefined>(undefined);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function seed() {
      const [tasks, starredMap] = await Promise.all([getCachedTasks(), getStarredMap()]);
      if (!mounted) return;
      const merged = mergeWithStarred(tasks, starredMap);
      setInitialData(merged);
    }

    seed();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const query = useQuery({
    queryKey: ["tasks", options],
    queryFn: async () => {
      const freshTasks = await fetchTasks(options);
      const starredMap = await getStarredMap();
      const merged = mergeWithStarred(freshTasks, starredMap);

      await Promise.all([
        setCachedTasks(freshTasks),
        setLastRefreshedAt(Date.now()),
      ]);

      return merged;
    },
    initialData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    NetInfo.fetch().then((state) => setIsOffline(!state.isConnected));
  }, []);

  const createTask = useCallback(
    async (payload: { title: string; description?: string; categoryId?: string; status?: string; dueDate?: string }) => {
      await apiCreateTask(payload);
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.refetchQueries({ queryKey: ["tasks"] });
    },
    [queryClient]
  );

  const updateTask = useCallback(
    async (id: string, payload: Partial<{ title: string; description: string; categoryId: string; status: string; dueDate: string }>) => {
      await apiUpdateTask(id, payload);
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.refetchQueries({ queryKey: ["tasks"] });
    },
    [queryClient]
  );

  const setTaskStatus = useCallback(
    async (id: string, status: "open" | "done") => {
      await apiSetTaskStatus(id, status);
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.refetchQueries({ queryKey: ["tasks"] });
    },
    [queryClient]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await apiDeleteTask(id);
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.refetchQueries({ queryKey: ["tasks"] });
    },
    [queryClient]
  );

  const toggleStarred = useCallback(async (taskId: string, current: boolean) => {
    await setStarred(taskId, !current);
    const starredMap = await getStarredMap();
    const cached = await getCachedTasks();
    const merged = mergeWithStarred(cached, starredMap);
    queryClient.setQueryData<TaskWithLocal[]>(["tasks", options], (old) => {
      if (!old) return merged;
      const map = new Map(old.map((t) => [t.id, t]));
      merged.forEach((t) => map.set(t.id, t));
      return Array.from(map.values());
    });
  }, [queryClient, options]);

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    isRefreshing: query.isFetching,
    isOffline,
    error: query.error,
    createTask,
    updateTask,
    setTaskStatus,
    deleteTask,
    toggleStarred,
    refetch: query.refetch,
    lastRefreshedAt: query.data ? Date.now() : undefined,
  };
}

function mergeWithStarred(tasks: Task[], starredMap: StarredMap): TaskWithLocal[] {
  return tasks.map((t) => ({ ...t, starred: !!starredMap[t.id] }));
}

async function setStarred(taskId: string, value: boolean): Promise<void> {
  const mod = await import("@/utils/mergeTasks");
  await mod.setStarred(taskId, value);
}
