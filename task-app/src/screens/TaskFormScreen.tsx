import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTasks } from "../hooks/useTasks";
import { useCategories } from "../hooks/useCategories";
import { colors } from "../constants/theme";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@/types/navigation";

type Props = {
  route: RouteProp<RootStackParamList, "CreateTask">;
  navigation: any;
};

export function TaskFormScreen({ route, navigation }: Props) {
  const { createTask } = useTasks();
  const { categories } = useCategories();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Required", "Please enter a task title");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        categoryId: categoryId || undefined,
        dueDate: dueDate.trim() || undefined,
        status: "open",
      });
      navigation.goBack();
    } catch {
      Alert.alert("Error", "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-primary text-2xl font-bold mb-4">New Task</Text>

        <View className="mb-4">
          <Text className="text-secondary text-xs font-semibold uppercase mb-1">Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            className="bg-surface-light rounded-lg px-3 py-2 text-primary border border-surface-mid"
            placeholder="Task title"
            placeholderTextColor={colors.textMuted}
            autoFocus
          />
        </View>

        <View className="mb-4">
          <Text className="text-secondary text-xs font-semibold uppercase mb-1">Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            className="bg-surface-light rounded-lg px-3 py-2 text-primary border border-surface-mid h-24"
            placeholder="Description"
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View className="mb-4">
          <Text className="text-secondary text-xs font-semibold uppercase mb-1">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setCategoryId("")}
                className={`px-3 py-[6px] rounded-full ${categoryId === "" ? "bg-accent" : "bg-surface-mid"}`}
              >
                <Text className={`text-xs font-semibold ${categoryId === "" ? "text-white" : "text-secondary"}`}>None</Text>
              </TouchableOpacity>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setCategoryId(cat.id)}
                  className={`px-3 py-[6px] rounded-full ${categoryId === cat.id ? "bg-accent" : "bg-surface-mid"}`}
                >
                  <Text className={`text-xs font-semibold ${categoryId === cat.id ? "text-white" : "text-secondary"}`}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="mb-4">
          <Text className="text-secondary text-xs font-semibold uppercase mb-1">Due Date (YYYY-MM-DD)</Text>
          <TextInput
            value={dueDate}
            onChangeText={setDueDate}
            className="bg-surface-light rounded-lg px-3 py-2 text-primary border border-surface-mid"
            placeholder="2026-07-25"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          className="bg-accent rounded-xl py-3 items-center mt-2"
        >
          <Text className="text-white font-semibold">{isSubmitting ? "Creating..." : "Create Task"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
