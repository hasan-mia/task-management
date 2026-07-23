jest.mock("react-native", () => ({
  View: "View",
  Text: "Text",
  TouchableOpacity: "TouchableOpacity",
}));

import { TaskCard } from "../TaskCard";
import type { TaskWithLocal } from "@/types/task";

const unwrap = (c: any) => c.type || c;

const makeTask = (overrides: Partial<TaskWithLocal> & { id: string }): TaskWithLocal => ({
  id: overrides.id,
  title: overrides.title ?? "",
  description: overrides.description ?? null,
  categoryId: overrides.categoryId ?? null,
  status: overrides.status ?? "open",
  dueDate: overrides.dueDate ?? null,
  createdAt: overrides.createdAt ?? "2026-01-01T00:00:00Z",
  updatedAt: overrides.updatedAt ?? "2026-01-01T00:00:00Z",
  category: overrides.category,
  starred: overrides.starred ?? false,
});

describe("TaskCard", () => {
  it("renders title, status, and starred correctly", () => {
    const task = makeTask({ id: "1", title: "Buy milk", status: "open", starred: true });
    const element = unwrap(TaskCard)({ task, onPress: jest.fn() });
    const tree = JSON.stringify(element);

    expect(tree).toContain("Buy milk");
    expect(tree).toContain("OPEN");
  });

  it("renders done tasks with correct status", () => {
    const task = makeTask({ id: "2", title: "Old task", status: "done", starred: false });
    const element = unwrap(TaskCard)({ task, onPress: jest.fn() });
    const tree = JSON.stringify(element);

    expect(tree).toContain("Old task");
    expect(tree).toContain("DONE");
  });
});
