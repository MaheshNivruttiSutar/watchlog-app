import { describe, expect, it } from 'vitest';
import { mockWatchlist } from './mockData.js';
import { calculateStatistics } from '../utils/statistics.js';
import {
  selectFilteredWatchlistItems,
  selectRecentlyAdded,
  selectWatchlistItems,
  selectWatchlistStatistics,
} from '../store/watchlistSelectors.js';
import type { WatchlistItem } from '../types/watchlistItem.js';

function stateWith(items: WatchlistItem[] = mockWatchlist) {
  return { watchlist: { items } };
}

describe('watchlistSelectors', () => {
  it('selects the raw items list', () => {
    expect(selectWatchlistItems(stateWith())).toEqual(mockWatchlist);
  });

  it('derives statistics from items', () => {
    expect(selectWatchlistStatistics(stateWith())).toEqual(
      calculateStatistics(mockWatchlist),
    );
  });

  it('returns the five most recently added items', () => {
    const recent = selectRecentlyAdded(stateWith());
    expect(recent).toHaveLength(5);
    expect(recent[0].dateAdded >= recent[4].dateAdded).toBe(true);
  });

  it('filters by type and status', () => {
    const movies = selectFilteredWatchlistItems(stateWith(), 'movie', 'all');
    expect(movies.every((item) => item.type === 'movie')).toBe(true);

    const done = selectFilteredWatchlistItems(stateWith(), 'all', 'done');
    expect(done.every((item) => item.status === 'done')).toBe(true);
  });
});
