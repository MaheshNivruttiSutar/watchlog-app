import { describe, it, expect } from 'vitest';
import { calculateStatistics } from '../utils/statistics.js';
import { mockWatchlist, emptyWatchlist } from './mockData.js';

describe('calculateStatistics', () => {
  it('calculates correct totals', () => {
    const stats = calculateStatistics(mockWatchlist);
    expect(stats.totalItems).toBe(7);
    expect(stats.movieCount).toBe(4);
    expect(stats.bookCount).toBe(3);
  });

  it('counts items by status', () => {
    const stats = calculateStatistics(mockWatchlist);
    expect(stats.wantCount).toBe(2);
    expect(stats.inProgressCount).toBe(2);
    expect(stats.doneCount).toBe(3);
  });

  it('calculates completion rate as percentage', () => {
    const stats = calculateStatistics(mockWatchlist);
    // 3 done out of 7 = ~43%
    expect(stats.completionRate).toBe(43);
  });

  it('calculates average rating of done items', () => {
    const stats = calculateStatistics(mockWatchlist);
    // Done items with ratings: 5, 4, 4 → average = 4.3
    expect(stats.averageRating).toBe(4.3);
  });

  it('returns zeros and null for empty watchlist', () => {
    const stats = calculateStatistics(emptyWatchlist);
    expect(stats.totalItems).toBe(0);
    expect(stats.completionRate).toBe(0);
    expect(stats.averageRating).toBeNull();
  });
});
