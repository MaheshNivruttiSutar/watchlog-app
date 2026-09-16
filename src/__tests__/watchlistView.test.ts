import { describe, expect, it } from 'vitest';
import { mockWatchlist } from './mockData.js';
import { calculateStatistics } from '../utils/statistics.js';
import {
  getFilteredWatchlistItems,
  getRecentlyAdded,
  getWatchlistStatistics,
  withUpdatedRating,
} from '../utils/watchlistView.js';

describe('watchlistView', () => {
  it('derives statistics from items', () => {
    expect(getWatchlistStatistics(mockWatchlist)).toEqual(
      calculateStatistics(mockWatchlist),
    );
  });

  it('returns the five most recently added items', () => {
    const recent = getRecentlyAdded(mockWatchlist);
    expect(recent).toHaveLength(5);
    expect(recent[0].dateAdded >= recent[4].dateAdded).toBe(true);
  });

  it('filters by type and status', () => {
    const movies = getFilteredWatchlistItems(mockWatchlist, 'movie', 'all');
    expect(movies.every((item) => item.type === 'movie')).toBe(true);

    const done = getFilteredWatchlistItems(mockWatchlist, 'all', 'done');
    expect(done.every((item) => item.status === 'done')).toBe(true);
  });

  it('updates one item rating without mutating the rest', () => {
    const next = withUpdatedRating(mockWatchlist, mockWatchlist[0].id, 2);
    expect(next[0].rating).toBe(2);
    expect(next[1].rating).toBe(mockWatchlist[1].rating);
    expect(mockWatchlist[0].rating).not.toBe(2);
  });
});
