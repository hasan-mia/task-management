import { StyleSheet } from "react-native";

export const colors = {
  accent: "#5B4CF0",
  accentDark: "#4338CA",
  surface: "#FFFFFF",
  surfaceLight: "#EDE9FE",
  surfaceMid: "#DDD6FE",
  textPrimary: "#1D1B4D",
  textSecondary: "#4B5563",
  textMuted: "#9CA3AF",
  liveRed: "#EF4444",
  focusBorder: "#5B4CF0",
  focusGlow: "rgba(91, 76, 240, 0.4)",
  success: "#22C55E",
  splashBackground: "#1D1B4D",
  darkStroke: "#2F2A6B",
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
