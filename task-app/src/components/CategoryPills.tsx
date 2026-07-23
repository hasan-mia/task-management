import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import type { Category } from "@/types/category";

interface CategoryPillsProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryPills({ categories, selectedId, onSelect }: CategoryPillsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      <TouchableOpacity
        onPress={() => onSelect(null)}
        className={`px-3 py-[6px] rounded-full mr-2 ${selectedId === null ? "bg-accent" : "bg-surface-mid"}`}
      >
        <Text className={`text-xs font-semibold ${selectedId === null ? "text-white" : "text-secondary"}`}>All</Text>
      </TouchableOpacity>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => onSelect(cat.id)}
          className={`px-3 py-[6px] rounded-full mr-2 ${selectedId === cat.id ? "bg-accent" : "bg-surface-mid"}`}
        >
          <Text className={`text-xs font-semibold ${selectedId === cat.id ? "text-white" : "text-secondary"}`}>
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
