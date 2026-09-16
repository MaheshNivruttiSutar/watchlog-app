import { mockWatchlist } from '../__tests__/mockData';
import type { WatchlistItem, WatchlistStatus } from '../types/watchlistItem';
import { loadWatchlist, saveWatchlist } from '../utils/watchlistStorage';

function readItems(): WatchlistItem[] {
  return loadWatchlist() ?? mockWatchlist;
}

export async function fetchWatchlist(): Promise<WatchlistItem[]> {
  return readItems();
}

export async function addWatchlistItem(
  item: WatchlistItem,
): Promise<WatchlistItem[]> {
  const items = readItems();
  if (items.some((entry) => entry.id === item.id)) {
    return items;
  }
  const next = [...items, item];
  saveWatchlist(next);
  return next;
}

export async function removeWatchlistItem(id: string): Promise<WatchlistItem[]> {
  const next = readItems().filter((item) => item.id !== id);
  saveWatchlist(next);
  return next;
}

export async function updateWatchlistStatus(
  id: string,
  status: WatchlistStatus,
): Promise<WatchlistItem[]> {
  const next = readItems().map((item) =>
    item.id === id ? { ...item, status } : item,
  );
  saveWatchlist(next);
  return next;
}

export const WATCHLIST_RATING_DELAY_MS = 400;

export class WatchlistApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WatchlistApiError';
  }
}

function wait(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function updateWatchlistRating(
  id: string,
  rating: number | null,
  options?: { simulateFailure?: boolean },
): Promise<WatchlistItem[]> {
  await wait(WATCHLIST_RATING_DELAY_MS);

  if (options?.simulateFailure) {
    throw new WatchlistApiError('Server rejected the rating');
  }

  const next = readItems().map((item) =>
    item.id === id ? { ...item, rating } : item,
  );
  saveWatchlist(next);
  return next;
}
