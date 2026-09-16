import type { ItemType } from '../types/watchlistItem';

/** Query keys — same key = same cache slot (and request dedupe). */
export const queryKeys = {
  watchlist: ['watchlist'] as const,
  popular: ['popular'] as const,
  search: (query: string, type: ItemType) =>
    ['search', type, query] as const,
};
