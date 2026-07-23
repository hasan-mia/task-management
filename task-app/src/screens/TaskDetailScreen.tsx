import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTasks } from "../hooks/useTasks";
import { useCategories } from "../hooks/useCategories";
import { StarButton } from "../components/StarButton";
import { colors } from "../constants/theme";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@/types/navigation";

type Props = {
  route: RouteProp<RootStackParamList, "TaskDetail">;
  navigation: any;
};

export function TaskDetailScreen({ route, navigation }: Props) {
  const { taskId } = route.params;
  const { tasks, updateTask, setTaskStatus, deleteTask, toggleStarred } = useTasks();
  const { categories } = useCategories();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [status, setStatus] = useState<"open" | "done">("open");

  const task = tasks.find((t) => t.id === taskId);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setCategoryId(task.categoryId ?? "");
      setStatus(task.status);
      navigation.setOptions({ title: task.title });
    }
  }, [task]);

  const handleSave = async () => {
    await updateTask(taskId, {
      title,
      description: description || undefined,
      categoryId: categoryId || undefined,
    });
    navigation.goBack();
  };

  const handleStatusToggle = async () => {
    const newStatus = status === "open" ? "done" : "open";
    await setTaskStatus(taskId, newStatus);
    setStatus(newStatus);
  };

  const handleDelete = () => {
    Alert.alert("Delete task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTask(taskId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!task) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <Text className="text-secondary">Task not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-primary text-2xl font-bold flex-1">{title}</Text>
          <StarButton starred={task.starred} onPress={() => toggleStarred(taskId, task.starred)} />
        </View>

        <View className="flex-row gap-2 mb-4">
          <TouchableOpacity
            onPress={handleStatusToggle}
            className={`px-4 py-2 rounded-full ${status === "done" ? "bg-surface-mid" : "bg-accent"}`}
          >
            <Text className={`text-sm font-semibold ${status === "done" ? "text-secondary" : "text-white"}`}>
              {status === "done" ? "Reopen" : "Complete"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="px-4 py-2 rounded-full bg-live-red/20">
            <Text className="text-sm font-semibold text-live-red">Delete</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-secondary text-xs font-semibold uppercase mb-1">Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            className="bg-surface-light rounded-lg px-3 py-2 text-primary border border-surface-mid"
            placeholder="Task title"
            placeholderTextColor={colors.textMuted}
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

        <TouchableOpacity
          onPress={handleSave}
          className="bg-accent rounded-xl py-3 items-center mt-2"
        >
          <Text className="text-white font-semibold">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
