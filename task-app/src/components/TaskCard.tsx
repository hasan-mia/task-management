import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { TaskWithLocal } from "@/types/task";
import { colors, spacing } from "../constants/theme";

interface TaskCardProps {
  task: TaskWithLocal;
  onPress: () => void;
}

export const TaskCard = memo(function TaskCard({ task, onPress }: TaskCardProps) {
  const statusColor = task.status === "done" ? colors.textMuted : colors.accent;
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="bg-surface-light rounded-xl border border-white/5 p-4 mb-3"
    >
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <Text className={`text-primary text-base font-semibold ${task.status === "done" ? "line-through text-muted" : ""}`} numberOfLines={2}>
            {task.title}
          </Text>
          {task.description ? (
            <Text className="text-secondary text-sm mt-1" numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}
          <View className="flex-row items-center gap-2 mt-2">
            {task.category ? (
              <View className="bg-surface-mid rounded-full px-2.5 py-[3px]">
                <Text className="text-secondary text-[11px] font-medium">{task.category.name}</Text>
              </View>
            ) : null}
            {dueDate ? (
              <View className="flex-row items-center gap-1">
                <Text className="text-muted text-[11px]">📅 {dueDate}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          {task.starred ? (
            <Text className="text-accent text-lg">★</Text>
          ) : null}
          <View
            className="px-2 py-[2px] rounded-full"
            style={{ backgroundColor: task.status === "done" ? colors.surfaceMid : colors.accent + "22" }}
          >
            <Text className="text-[11px] font-semibold" style={{ color: statusColor }}>
              {task.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});
