import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (
          error?.message?.includes("401") ||
          error?.message?.includes("Unauthorized")
        ) {
          return false;
        }
        if (error?.name === "TypeError" && error?.message?.includes("fetch")) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: false,
    },
  },
});
