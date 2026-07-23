import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { colors } from "../constants/theme";

interface StarButtonProps {
  starred: boolean;
  onPress: () => void;
}

export function StarButton({ starred, onPress }: StarButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text className={`text-2xl ${starred ? "text-accent" : "text-muted"}`}>
        {starred ? "★" : "☆"}
      </Text>
    </TouchableOpacity>
  );
}
