// src/api/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 min — mock data doesn't change server-side
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
