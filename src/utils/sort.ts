import type { WatchlistItem } from '../types/watchlistItem.js';

/**
 * Sort items by star rating.
 * Items without a rating go to the end.
 *
 * @param order 'desc' = highest rating first (default), 'asc' = lowest first
 */
export function sortByRating(
  items: WatchlistItem[],
  order: 'asc' | 'desc' = 'desc',
): WatchlistItem[] {
  const sorted = [...items].sort((a, b) => {
    const ratingA = a.rating ?? 0;
    const ratingB = b.rating ?? 0;
    return order === 'desc' ? ratingB - ratingA : ratingA - ratingB;
  });
  return sorted;
}

/**
 * Sort items by the date they were added to the watchlist.
 *
 * @param order 'desc' = newest first (default), 'asc' = oldest first
 */
export function sortByDateAdded(
  items: WatchlistItem[],
  order: 'asc' | 'desc' = 'desc',
): WatchlistItem[] {
  const sorted = [...items].sort((a, b) => {
    const dateA = new Date(a.dateAdded).getTime();
    const dateB = new Date(b.dateAdded).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
  return sorted;
}
