import { useEffect } from "react";
import { useTasksQuery } from "./useTasksQuery";
import { useBoardStore } from "../stores/boardStore";

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
