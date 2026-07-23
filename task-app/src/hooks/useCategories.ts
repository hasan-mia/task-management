import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategories, createCategory as apiCreateCategory } from "@/api/categories";
import { getCachedCategories, setCachedCategories, getLastRefreshedAt, setLastRefreshedAt } from "@/utils/mergeTasks";
import NetInfo from "@react-native-community/netinfo";
import type { Category } from "@/types/category";

export function useCategories() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    NetInfo.fetch().then((state) => setIsOffline(!state.isConnected));

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    return unsubscribe;
  }, []);

  const query = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await fetchCategories({});
      await Promise.all([setCachedCategories(data), setLastRefreshedAt(Date.now())]);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const queryClient = useQueryClient();

  const createCategory = async (name: string) => {
    const created = await apiCreateCategory({ name });
    await queryClient.invalidateQueries({ queryKey: ["categories"] });
    return created;
  };

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isRefreshing: query.isFetching,
    isOffline,
    error: query.error,
    createCategory,
    refetch: query.refetch,
  };
}
