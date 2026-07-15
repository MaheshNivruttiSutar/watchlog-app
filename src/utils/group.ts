import type { WatchlistItem } from '../types/watchlistItem.js';

/**
 * Group items by genre.
 * An item with multiple genres appears in each matching group.
 *
 * Returns an object like:
 *   { "Sci-Fi": [item1, item2], "Drama": [item3] }
 */
export function groupByGenre(
  items: WatchlistItem[],
): Record<string, WatchlistItem[]> {
  const groups: Record<string, WatchlistItem[]> = {};

  for (const item of items) {
    for (const genre of item.genres) {
      if (!groups[genre]) {
        groups[genre] = [];
      }
      groups[genre].push(item);
    }
  }

  return groups;
}
