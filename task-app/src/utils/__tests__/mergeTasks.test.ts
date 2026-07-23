jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

import { mergeTasksWithStarred } from "../mergeTasks";
import type { Task, StarredMap, TaskWithLocal } from "@/types/task";

const makeTask = (overrides: Partial<Task> & { id: string }): Task => ({
  id: overrides.id,
  title: overrides.title ?? "",
  description: overrides.description ?? null,
  categoryId: overrides.categoryId ?? null,
  status: overrides.status ?? "open",
  dueDate: overrides.dueDate ?? null,
  createdAt: overrides.createdAt ?? "2026-01-01T00:00:00Z",
  updatedAt: overrides.updatedAt ?? "2026-01-01T00:00:00Z",
  category: overrides.category,
});

describe("mergeTasksWithStarred", () => {
  it("marks starred tasks correctly", () => {
    const fresh = [
      makeTask({ id: "1", title: "Old title" }),
      makeTask({ id: "2", title: "Untitled" }),
    ];
    const starredMap: StarredMap = { "1": true };

    const result = mergeTasksWithStarred(fresh, starredMap);

    expect(result).toHaveLength(2);
    expect(result[0].starred).toBe(true);
    expect(result[1].starred).toBe(false);
  });

  it("preserves starred flag after title update", () => {
    const fresh = [
      makeTask({ id: "1", title: "New title" }),
    ];
    const starredMap: StarredMap = { "1": true };

    const result = mergeTasksWithStarred(fresh, starredMap);

    expect(result[0].starred).toBe(true);
    expect(result[0].title).toBe("New title");
  });

  it("defaults to false when task not in starred map", () => {
    const fresh = [makeTask({ id: "1", title: "Task" })];
    const starredMap: StarredMap = { "99": true };

    const result = mergeTasksWithStarred(fresh, starredMap);

    expect(result[0].starred).toBe(false);
  });

  it("returns empty when input is empty", () => {
    expect(mergeTasksWithStarred([], {})).toEqual([]);
  });
});
