import { QueryClient } from "@tanstack/react-query";

// Galat 4xx (validasi, 401, 403, 404) tidak akan berubah bila diulang;
// galat jaringan atau 5xx dicoba sekali lagi.
function shouldRetry(failureCount: number, error: unknown): boolean {
  const status = (error as { status?: number } | null)?.status ?? 0;
  return failureCount < 1 && !(status >= 400 && status < 500);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
