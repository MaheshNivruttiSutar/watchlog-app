import type { ItemType, WatchlistItem, WatchlistStatus } from '../types/watchlistItem';
import { filterByStatus, filterByType } from './filter';
import { sortByDateAdded } from './sort';
import { calculateStatistics } from './statistics';

export function getWatchlistStatistics(items: WatchlistItem[]) {
  return calculateStatistics(items);
}

export function getRecentlyAdded(items: WatchlistItem[], limit = 5) {
  return sortByDateAdded(items, 'desc').slice(0, limit);
}

export function getFilteredWatchlistItems(
  items: WatchlistItem[],
  type: ItemType | 'all',
  status: WatchlistStatus | 'all',
): WatchlistItem[] {
  let next = items;
  if (type !== 'all') next = filterByType(next, type);
  if (status !== 'all') next = filterByStatus(next, status);
  return next;
}

export function withUpdatedRating(
  items: WatchlistItem[],
  id: string,
  rating: number | null,
): WatchlistItem[] {
  return items.map((item) =>
    item.id === id ? { ...item, rating } : item,
  );
}
