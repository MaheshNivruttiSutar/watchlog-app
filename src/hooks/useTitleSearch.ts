import { useQuery } from '@tanstack/react-query';
import {
  isTransientSearchError,
  search,
  SearchApiError,
} from '../api/search';
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

export type SearchErrorKey =
  | 'errors.network'
  | 'errors.tmdbNotConfigured'
  | 'errors.searchFailed';

/** Convert technical API failures into safe, translatable UI message keys. */
export function getSearchErrorKey(error: unknown): SearchErrorKey {
  if (!(error instanceof SearchApiError)) return 'errors.searchFailed';

  if (
    error.statusCode === undefined &&
    error.message.startsWith('Network error')
  ) {
    return 'errors.network';
  }

  if (error.source === 'tmdb' && error.statusCode === undefined) {
    return 'errors.tmdbNotConfigured';
  }

  return 'errors.searchFailed';
}
