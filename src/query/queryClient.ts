import { QueryClient } from '@tanstack/react-query';

/**
 * One shared cache for the whole app.
 * staleTime: reuse cached data for 30s (search/popular/watchlist).
 * refetchOnWindowFocus: background refetch when you return to the tab.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  },
});
