import { useQuery } from "@tanstack/react-query";
import { getTasks, getUsers, getSprints } from "../api/mockDataService";

export function useTasksQuery() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
}

export function useUsersQuery() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}

export function useSprintsQuery() {
  return useQuery({
    queryKey: ["sprints"],
    queryFn: getSprints,
  });
}
