import type { ItemType, WatchlistItem, WatchlistStatus } from '../types/watchlistItem.js';

/**
 * Keep only items that match the given status.
 * Example: filterByStatus(items, 'done') → all finished items
 */
export function filterByStatus(
  items: WatchlistItem[],
  status: WatchlistStatus,
): WatchlistItem[] {
  return items.filter((item) => item.status === status);
}

/**
 * Keep only movies or only books.
 * Example: filterByType(items, 'movie') → all movies
 */
export function filterByType(
  items: WatchlistItem[],
  type: ItemType,
): WatchlistItem[] {
  return items.filter((item) => item.type === type);
}

/**
 * Keep only items that have a specific genre.
 * Genre matching is case-insensitive.
 * Example: filterByGenre(items, 'Sci-Fi')
 */
export function filterByGenre(
  items: WatchlistItem[],
  genre: string,
): WatchlistItem[] {
  const lower = genre.toLowerCase();
  return items.filter((item) =>
    item.genres.some((g) => g.toLowerCase() === lower),
  );
}
