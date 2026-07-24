import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { colors } from "../constants/theme";

interface SyncStatusBarProps {
  lastRefreshedAt?: number;
  isRefreshing: boolean;
  isOffline: boolean;
}

const formatRelativeTime = (ts: number): string => {
  const diff = Date.now() - ts;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

export function SyncStatusBar({ lastRefreshedAt, isRefreshing, isOffline }: SyncStatusBarProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-2 bg-surface border-b border-surface-mid">
      <View className="flex-row items-center gap-2">
        {isOffline && (
          <View className="bg-live-red/20 px-2 py-[3px] rounded-full">
            <Text className="text-live-red text-[11px] font-semibold">Offline</Text>
          </View>
        )}
        {isRefreshing ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <View className="w-2 h-2 rounded-full bg-emerald-500" />
        )}
        {isRefreshing ? (
          <Text className="text-muted text-xs">Syncing...</Text>
        ) : lastRefreshedAt ? (
          <Text className="text-muted text-xs">Last refreshed: {formatRelativeTime(lastRefreshedAt)}</Text>
        ) : null}
      </View>
    </View>
  );
}