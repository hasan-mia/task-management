import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCategories } from "../hooks/useCategories";
import { CategoryListItem } from "../components/CategoryListItem";

export function CategoriesScreen() {
  const { categories, createCategory, isLoading } = useCategories();
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) return;
    await createCategory(name.trim());
    setName("");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-4 py-3 border-b border-surface-mid">
        <Text className="text-primary text-lg font-semibold mb-2">Categories</Text>
        <View className="flex-row gap-2">
          <TextInput
            value={name}
            onChangeText={setName}
            className="flex-1 bg-surface-light rounded-lg px-3 py-2 text-primary border border-surface-mid"
            placeholder="New category name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />
          <TouchableOpacity onPress={handleAdd} className="bg-accent rounded-lg px-4 justify-center">
            <Text className="text-white font-semibold">Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        renderItem={({ item }) => <CategoryListItem category={item} onPress={() => {}} />}
        ListEmptyComponent={
          <View className="items-center py-8">
            <Text className="text-secondary text-sm">No categories yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
