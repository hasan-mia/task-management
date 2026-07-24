import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import type { Category } from "@/types/category";

interface TaskListFiltersProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  status: "all" | "open" | "done";
  onSelectStatus: (status: "all" | "open" | "done") => void;
  sortBy: "dueDate" | "createdAt";
  sortOrder: "ASC" | "DESC";
  onSortChange: (sortBy: "dueDate" | "createdAt", sortOrder: "ASC" | "DESC") => void;
  dueDatePreset: "all" | "today" | "thisWeek" | "overdue" | "next7Days";
  onSelectDueDatePreset: (preset: "all" | "today" | "thisWeek" | "overdue" | "next7Days") => void;
}

export function TaskListFilters({
  categories,
  selectedCategoryId,
  onSelectCategory,
  status,
  onSelectStatus,
  sortBy,
  sortOrder,
  onSortChange,
  dueDatePreset,
  onSelectDueDatePreset,
}: TaskListFiltersProps) {
  const statusFilters: { label: string; value: "all" | "open" | "done" }[] = [
    { label: "All", value: "all" },
    { label: "Open", value: "open" },
    { label: "Done", value: "done" },
  ];

  const dueDateFilters: { label: string; value: "all" | "today" | "thisWeek" | "overdue" | "next7Days" }[] = [
    { label: "All", value: "all" },
    { label: "Today", value: "today" },
    { label: "Week", value: "thisWeek" },
    { label: "Overdue", value: "overdue" },
    { label: "Next 7 Days", value: "next7Days" },
  ];

  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === "ASC" ? "DESC" : "ASC");
  };

  return (
    <View className="bg-surface border-b border-surface-mid px-4 py-3 gap-3 mb-4">
      <View className="flex-row gap-2">
        {statusFilters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            onPress={() => onSelectStatus(filter.value)}
            className={`px-3 py-[6px] rounded-full ${status === filter.value ? "bg-accent" : "bg-surface-mid"}`}
          >
            <Text className={`text-xs font-semibold ${status === filter.value ? "text-white" : "text-secondary"}`}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row gap-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
          <TouchableOpacity
            onPress={() => onSelectCategory(null)}
            className={`px-3 py-[6px] rounded-full mr-2 ${selectedCategoryId === null ? "bg-accent" : "bg-surface-mid"}`}
          >
            <Text className={`text-xs font-semibold ${selectedCategoryId === null ? "text-white" : "text-secondary"}`}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              className={`px-3 py-[6px] rounded-full mr-2 ${selectedCategoryId === cat.id ? "bg-accent" : "bg-surface-mid"}`}
            >
              <Text className={`text-xs font-semibold ${selectedCategoryId === cat.id ? "text-white" : "text-secondary"}`}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={toggleSortOrder}
          className="px-3 py-[6px] rounded-full bg-surface-mid self-start"
        >
          <Text className="text-xs font-semibold text-secondary">
            {sortBy === "dueDate" ? "Due Date" : "Created"} ({sortOrder === "ASC" ? "↑" : "↓"})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
        <View className="flex-row gap-2 px-1">
          {dueDateFilters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              onPress={() => onSelectDueDatePreset(filter.value)}
              className={`px-3 py-[6px] rounded-full ${dueDatePreset === filter.value ? "bg-accent" : "bg-surface-mid"}`}
            >
              <Text className={`text-xs font-semibold ${dueDatePreset === filter.value ? "text-white" : "text-secondary"}`}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
