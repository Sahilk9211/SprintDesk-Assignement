// src/hooks/useCommentsQuery.ts
import { useQuery } from "@tanstack/react-query";
import { getComments } from "../api/mockDataService";

export function useCommentsQuery(taskId: number) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => getComments(taskId),
  });
}
