import type { WatchlistItem, WatchlistStatistics } from '../types/watchlistItem.js';

/**
 * Calculate summary stats for the whole watchlist.
 *
 * - totalItems: how many items total
 * - completionRate: % of items marked "done"
 * - averageRating: average stars across done items that have a rating
 */
export function calculateStatistics(
  items: WatchlistItem[],
): WatchlistStatistics {
  const totalItems = items.length;
  const movieCount = items.filter((i) => i.type === 'movie').length;
  const bookCount = items.filter((i) => i.type === 'book').length;
  const wantCount = items.filter((i) => i.status === 'want').length;
  const inProgressCount = items.filter(
    (i) => i.status === 'watching' || i.status === 'reading',
  ).length;
  const doneCount = items.filter((i) => i.status === 'done').length;

  const completionRate =
    totalItems === 0 ? 0 : Math.round((doneCount / totalItems) * 100);

  const ratedDoneItems = items.filter(
    (i) => i.status === 'done' && i.rating !== null,
  );
  const averageRating =
    ratedDoneItems.length === 0
      ? null
      : Math.round(
        (ratedDoneItems.reduce((sum, i) => sum + (i.rating ?? 0), 0) /
          ratedDoneItems.length) *
        10,
      ) / 10;

  return {
    totalItems,
    movieCount,
    bookCount,
    wantCount,
    inProgressCount,
    doneCount,
    completionRate,
    averageRating,
  };
}
