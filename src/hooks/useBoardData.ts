// src/hooks/useBoardData.ts
import { useEffect } from "react";
import { useTasksQuery } from "./useTasksQuery";
import { useBoardStore } from "../stores/boardStore";

// Bridges the server-fetched task list into the client-owned board store.
// Call this once near the top of the Board page.
export function useBoardData() {
  const { data: serverTasks, isLoading, isError } = useTasksQuery();
  const hydrate = useBoardStore((s) => s.hydrate);
  const tasks = useBoardStore((s) => s.tasks);

  useEffect(() => {
    if (serverTasks) {
      hydrate(serverTasks);
    }
  }, [serverTasks, hydrate]);

  return { tasks, isLoading, isError };
}
