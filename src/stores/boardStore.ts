// src/stores/boardStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, TaskStatus } from "../types";

interface BoardStore {
  tasks: Task[];
  isHydrated: boolean; // has board been seeded from server data at least once?
  hydrate: (serverTasks: Task[]) => void;
  moveTask: (taskId: number, newStatus: TaskStatus, newOrder: number) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;
  updateTask: (taskId: number, patch: Partial<Task>) => void;
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      isHydrated: false,

      // Only seeds from the server the FIRST time (isHydrated false).
      // On later app loads, persisted (possibly reordered) tasks win —
      // we don't want a fresh server fetch to silently undo a user's
      // drag-and-drop changes from a previous session.
      hydrate: (serverTasks) => {
        if (get().isHydrated) return;
        set({ tasks: serverTasks, isHydrated: true });
      },

      moveTask: (taskId, newStatus, newOrder) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const updated = state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: newStatus,
                  order: newOrder,
                  updatedAt: new Date().toISOString(),
                }
              : t,
          );
          return { tasks: updated };
        });
      },

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

      deleteTask: (taskId) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) })),

      updateTask: (taskId, patch) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, ...patch, updatedAt: new Date().toISOString() }
              : t,
          ),
        })),
    }),
    {
      name: "sprintdesk-board",
    },
  ),
);
