export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "open" | "done";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  categoryId: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string };
}

export type StarredMap = Record<string, boolean>;

export interface TaskWithLocal extends Task {
  starred: boolean;
}
