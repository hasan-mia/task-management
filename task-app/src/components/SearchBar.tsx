import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { colors } from "../constants/theme";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search tasks..." }: SearchBarProps) {
  const debouncedValue = useDebouncedValue(value, 300);

  React.useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center bg-surface-light rounded-full px-3.5 h-10 border border-surface-mid">
        <Ionicons name="search" size={17} color={colors.textMuted} />
        <TextInput
          className="flex-1 text-primary text-sm ml-2"
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChange}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChange("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
