import { useQuery } from '@tanstack/react-query';
import { isTransientSearchError, search } from '../api/search';
import { queryKeys } from '../query/keys';
import type { ItemType } from '../types/watchlistItem';

export const SEARCH_MAX_ATTEMPTS = 3;
export const SEARCH_RETRY_DELAY_MS = 300;

export function useTitleSearch(query: string, type: ItemType, enabled: boolean) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: queryKeys.search(trimmed, type),
    queryFn: () => search(trimmed, type),
    enabled: enabled && trimmed.length > 0,
    retry: (failureCount, error) =>
      isTransientSearchError(error) && failureCount < SEARCH_MAX_ATTEMPTS - 1,
    retryDelay: SEARCH_RETRY_DELAY_MS,
  });
}

export function searchErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Something went wrong. Please try again.';
}
