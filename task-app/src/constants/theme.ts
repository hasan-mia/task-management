import { StyleSheet } from "react-native";

export const colors = {
  accent: "#E63946",
  accentDark: "#C1121F",
  surface: "#0F0F0F",
  surfaceLight: "#1A1A1A",
  surfaceMid: "#262626",
  textPrimary: "#FFFFFF",
  textSecondary: "#A3A3A3",
  textMuted: "#737373",
  liveRed: "#EF4444",
  focusBorder: "#E63946",
  focusGlow: "rgba(230, 57, 70, 0.4)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const focusRing = {
  borderColor: colors.focusBorder,
  borderWidth: 3,
  shadowColor: colors.focusGlow,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 8,
};

export const tvFocusable = {
  minWidth: 120,
  minHeight: 80,
  padding: spacing.md,
};
