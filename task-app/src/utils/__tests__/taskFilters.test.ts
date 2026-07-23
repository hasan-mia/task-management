import { filterAndSortTasks } from "../taskFilters";
import type { TaskWithLocal } from "@/types/task";

const makeTask = (overrides: Partial<TaskWithLocal> & { id: string }): TaskWithLocal => ({
  id: overrides.id,
  title: overrides.title ?? "",
  description: overrides.description ?? null,
  categoryId: overrides.categoryId ?? null,
  status: overrides.status ?? "open",
  dueDate: overrides.dueDate ?? null,
  createdAt: overrides.createdAt ?? new Date().toISOString(),
  updatedAt: overrides.updatedAt ?? new Date().toISOString(),
  category: overrides.category,
  starred: overrides.starred ?? false,
});

describe("filterAndSortTasks", () => {
  const tasks: TaskWithLocal[] = [
    makeTask({ id: "1", title: "Buy milk", categoryId: "cat1", status: "open", dueDate: "2026-07-25T00:00:00Z", createdAt: "2026-07-20T00:00:00Z" }),
    makeTask({ id: "2", title: "Write report", categoryId: "cat2", status: "done", dueDate: "2026-07-22T00:00:00Z", createdAt: "2026-07-19T00:00:00Z" }),
    makeTask({ id: "3", title: "Clean house", categoryId: "cat1", status: "open", dueDate: "2026-07-30T00:00:00Z", createdAt: "2026-07-21T00:00:00Z" }),
  ];

  it("filters by category", () => {
    const result = filterAndSortTasks(tasks, { categoryId: "cat1" });
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id)).toEqual(["1", "3"]);
  });

  it("filters by status", () => {
    const result = filterAndSortTasks(tasks, { status: "open" });
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id)).toEqual(["1", "3"]);
  });

  it("filters by search", () => {
    const result = filterAndSortTasks(tasks, { search: "milk" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("matches description in search", () => {
    const result = filterAndSortTasks(tasks, { search: "report" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("sorts by dueDate ASC", () => {
    const result = filterAndSortTasks(tasks, { sortBy: "dueDate", sortOrder: "ASC" });
    expect(result.map((t) => t.id)).toEqual(["2", "1", "3"]);
  });

  it("sorts by dueDate DESC", () => {
    const result = filterAndSortTasks(tasks, { sortBy: "dueDate", sortOrder: "DESC" });
    expect(result.map((t) => t.id)).toEqual(["3", "1", "2"]);
  });

  it("sorts by createdAt ASC", () => {
    const result = filterAndSortTasks(tasks, { sortBy: "createdAt", sortOrder: "ASC" });
    expect(result.map((t) => t.id)).toEqual(["2", "1", "3"]);
  });

  it("sorts by createdAt DESC", () => {
    const result = filterAndSortTasks(tasks, { sortBy: "createdAt", sortOrder: "DESC" });
    expect(result.map((t) => t.id)).toEqual(["3", "1", "2"]);
  });

  it("returns all when no filters", () => {
    expect(filterAndSortTasks(tasks, {})).toHaveLength(3);
  });

  it("filters by dueDatePreset today", () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const todayStr = `${y}-${m}-${d}T00:00:00Z`;

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const y2 = yesterday.getFullYear();
    const m2 = String(yesterday.getMonth() + 1).padStart(2, "0");
    const d2 = String(yesterday.getDate()).padStart(2, "0");
    const yesterdayStr = `${y2}-${m2}-${d2}T00:00:00Z`;

    const result = filterAndSortTasks(
      [
        makeTask({ id: "4", title: "Today task", dueDate: todayStr, status: "open", createdAt: "2026-07-25T00:00:00Z" }),
        makeTask({ id: "5", title: "Yesterday task", dueDate: yesterdayStr, status: "open", createdAt: "2026-07-25T00:00:00Z" }),
      ],
      { dueDatePreset: "today" }
    );
    expect(result.map((t) => t.id)).toEqual(["4"]);
  });

  it("filters by dueDatePreset overdue", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const y = yesterday.getFullYear();
    const m = String(yesterday.getMonth() + 1).padStart(2, "0");
    const d = String(yesterday.getDate()).padStart(2, "0");
    const yesterdayStr = `${y}-${m}-${d}T00:00:00Z`;

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nY = nextWeek.getFullYear();
    const nM = String(nextWeek.getMonth() + 1).padStart(2, "0");
    const nD = String(nextWeek.getDate()).padStart(2, "0");
    const nextWeekStr = `${nY}-${nM}-${nD}T00:00:00Z`;

    const overdueTasks = [
      makeTask({ id: "over1", title: "Overdue task", categoryId: "cat2", status: "open", dueDate: yesterdayStr, createdAt: "2026-07-19T00:00:00Z" }),
      makeTask({ id: "over2", title: "Future task", categoryId: "cat2", status: "open", dueDate: nextWeekStr, createdAt: "2026-07-19T00:00:00Z" }),
    ];

    const result = filterAndSortTasks(overdueTasks, { dueDatePreset: "overdue" });
    expect(result.map((t) => t.id)).toEqual(["over1"]);
  });

  it("filters by dueDatePreset next7Days", () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nwY = nextWeek.getFullYear();
    const nwM = String(nextWeek.getMonth() + 1).padStart(2, "0");
    const nwD = String(nextWeek.getDate()).padStart(2, "0");
    const nextWeekStr = `${nwY}-${nwM}-${nwD}T00:00:00Z`;

    const future = new Date();
    future.setDate(future.getDate() + 14);
    const fY = future.getFullYear();
    const fM = String(future.getMonth() + 1).padStart(2, "0");
    const fD = String(future.getDate()).padStart(2, "0");
    const futureStr = `${fY}-${fM}-${fD}T00:00:00Z`;

    const tasksWithDates = [
      ...tasks,
      makeTask({ id: "4", title: "Next week task", dueDate: nextWeekStr, status: "open", createdAt: "2026-07-25T00:00:00Z" }),
      makeTask({ id: "5", title: "Far future task", dueDate: futureStr, status: "open", createdAt: "2026-07-25T00:00:00Z" }),
    ];

    const result = filterAndSortTasks(tasksWithDates, { dueDatePreset: "next7Days" });
    const ids = result.map((t) => t.id);
    expect(ids).toContain("1");
    expect(ids).toContain("4");
    expect(ids).not.toContain("5");
  });
});
