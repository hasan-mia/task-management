import React, { useState, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTasks } from "../hooks/useTasks";
import { useCategories } from "../hooks/useCategories";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { TaskCard } from "../components/TaskCard";
import { SearchBar } from "../components/SearchBar";
import { SyncStatusBar } from "../components/SyncStatusBar";
import { TaskListFilters } from "../components/TaskListFilters";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "TaskList">;
};

export function TaskListScreen({ navigation }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "open" | "done">("all");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [dueDatePreset, setDueDatePreset] = useState<"all" | "today" | "thisWeek" | "overdue" | "next7Days">("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  const { categories } = useCategories();

  const { tasks, isLoading, isRefreshing, isOffline, refetch } = useTasks();

  const filtered = useTaskFilters(tasks, {
    search,
    categoryId: categoryId ?? undefined,
    status: status === "all" ? undefined : status,
    dueDatePreset: dueDatePreset === "all" ? undefined : dueDatePreset,
    sortBy,
    sortOrder,
  });

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const hasTasks = tasks.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <SyncStatusBar isRefreshing={isRefreshing} isOffline={isOffline} />
      <SearchBar value={search} onChange={setSearch} />
      <TaskListFilters
        categories={categories}
        selectedCategoryId={categoryId}
        onSelectCategory={setCategoryId}
        status={status}
        onSelectStatus={setStatus}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(by, order) => {
          setSortBy(by);
          setSortOrder(order);
        }}
        dueDatePreset={dueDatePreset}
        onSelectDueDatePreset={setDueDatePreset}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E63946" />
          <Text className="text-secondary mt-2">Loading tasks...</Text>
        </View>
      ) : !hasTasks ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-4xl mb-3">📝</Text>
          <Text className="text-secondary text-center text-sm">No tasks yet. Add one to get started.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#E63946" />}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
            />
          )}
        />
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateTask")}
        className="absolute bottom-14 right-6 bg-accent w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 8 }}
      >
        <Text className="text-white text-3xl font-bold leading-none">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
