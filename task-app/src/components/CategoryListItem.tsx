import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { Category } from "@/types/category";

interface CategoryListItemProps {
  category: Category;
  onPress: () => void;
}

export function CategoryListItem({ category, onPress }: CategoryListItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-between bg-surface-light rounded-xl border border-dark-stroke/10 px-4 py-3 mb-3"
    >
      <View>
        <Text className="text-primary text-base font-semibold">{category.name}</Text>
        <Text className="text-muted text-xs mt-0.5">
          {new Date(category.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
