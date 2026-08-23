import { describe, it, expect, beforeEach } from "vitest";
import { useBoardStore } from "./boardStore";
import type { Task } from "../types";

const mockTask: Task = {
  id: 1,
  title: "Test task",
  description: "",
  status: "backlog",
  priority: "medium",
  assigneeId: 1,
  dueDate: "2026-08-25",
  sprintId: 3,
  order: 1,
  createdAt: "2026-08-01T00:00:00Z",
  completedAt: null,
  updatedAt: "2026-08-01T00:00:00Z",
};

describe("boardStore", () => {
  beforeEach(() => {
    useBoardStore.setState({ tasks: [], isHydrated: false });
  });

  it("adds a task", () => {
    useBoardStore.getState().addTask(mockTask);
    expect(useBoardStore.getState().tasks).toHaveLength(1);
  });

  it("moves a task to a new status and order", () => {
    useBoardStore.getState().addTask(mockTask);
    useBoardStore.getState().moveTask(1, "in-progress", 1);

    const updated = useBoardStore.getState().tasks.find((t) => t.id === 1);
    expect(updated?.status).toBe("in-progress");
    expect(updated?.order).toBe(1);
  });

  it("deletes a task", () => {
    useBoardStore.getState().addTask(mockTask);
    useBoardStore.getState().deleteTask(1);
    expect(useBoardStore.getState().tasks).toHaveLength(0);
  });

  it("only hydrates once", () => {
    useBoardStore.getState().hydrate([mockTask]);
    useBoardStore.getState().moveTask(1, "done", 1);
    useBoardStore.getState().hydrate([{ ...mockTask, status: "backlog" }]);

    expect(useBoardStore.getState().tasks[0].status).toBe("done");
  });
});
