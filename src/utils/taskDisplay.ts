import type { TaskPriority, TaskStatus } from "../types";

export const priorityColor: Record<TaskPriority, "gray" | "yellow" | "red"> = {
  low: "gray",
  medium: "yellow",
  high: "red",
};

export const statusLabel: Record<TaskStatus, string> = {
  backlog: "Backlog",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

export const statusOrder: TaskStatus[] = [
  "backlog",
  "in-progress",
  "review",
  "done",
];
