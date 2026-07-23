import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TaskListScreen } from "../screens/TaskListScreen";
import { TaskDetailScreen } from "../screens/TaskDetailScreen";
import { CategoriesScreen } from "../screens/CategoriesScreen";
import { TaskFormScreen } from "../screens/TaskFormScreen";
import { colors } from "../constants/theme";
import type { RootStackParamList } from "@/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.surface },
        }}
      >
        <Stack.Screen name="TaskList" component={TaskListScreen} />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="CreateTask" component={TaskFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
