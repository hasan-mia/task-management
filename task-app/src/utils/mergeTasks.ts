import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Task, StarredMap, TaskWithLocal } from "@/types/task";

const TASK_CACHE_KEY = "taskCache";
const STARRED_MAP_KEY = "starredMap";
const CATEGORY_CACHE_KEY = "categoryCache";
const LAST_REFRESHED_KEY = "lastRefreshedAt";

export function mergeTasksWithStarred(
  freshTasks: Task[],
  starredMap: StarredMap
): TaskWithLocal[] {
  return freshTasks.map((t) => ({ ...t, starred: !!starredMap[t.id] }));
}

export async function getCachedTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(TASK_CACHE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function setCachedTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TASK_CACHE_KEY, JSON.stringify(tasks));
  } catch {
    // noop
  }
}

export async function getLastRefreshedAt(): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(LAST_REFRESHED_KEY);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export async function setLastRefreshedAt(ts: number): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_REFRESHED_KEY, String(ts));
  } catch {
    // noop
  }
}

export async function getStarredMap(): Promise<StarredMap> {
  try {
    const raw = await AsyncStorage.getItem(STARRED_MAP_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function setStarred(taskId: string, value: boolean): Promise<void> {
  try {
    const map = await getStarredMap();
    if (value) {
      map[taskId] = true;
    } else {
      delete map[taskId];
    }
    await AsyncStorage.setItem(STARRED_MAP_KEY, JSON.stringify(map));
  } catch {
    // noop
  }
}

export async function getCachedCategories(): Promise<any[]> {
  try {
    const raw = await AsyncStorage.getItem(CATEGORY_CACHE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function setCachedCategories(categories: any[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify(categories));
  } catch {
    // noop
  }
}
