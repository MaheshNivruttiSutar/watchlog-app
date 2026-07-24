import { describe, it, expect } from 'vitest';
import { calculateStatistics } from '../utils/statistics.js';
import { mockWatchlist, emptyWatchlist } from './mockData.js';

describe('calculateStatistics', () => {
  it('calculates correct totals', () => {
    const stats = calculateStatistics(mockWatchlist);
    expect(stats.totalItems).toBe(10);
    expect(stats.movieCount).toBe(6);
    expect(stats.bookCount).toBe(4);
  });

  it('counts items by status', () => {
    const stats = calculateStatistics(mockWatchlist);
    expect(stats.wantCount).toBe(3);
    expect(stats.inProgressCount).toBe(3);
    expect(stats.doneCount).toBe(4);
  });

  it('calculates completion rate as percentage', () => {
    const stats = calculateStatistics(mockWatchlist);
    // 4 done out of 10 = 40%
    expect(stats.completionRate).toBe(40);
  });

  it('calculates average rating of done items', () => {
    const stats = calculateStatistics(mockWatchlist);
    // Done items with ratings: 5, 4, 4, 3 → average = 4.0
    expect(stats.averageRating).toBe(4);
  });

  it('returns zeros and null for empty watchlist', () => {
    const stats = calculateStatistics(emptyWatchlist);
    expect(stats.totalItems).toBe(0);
    expect(stats.completionRate).toBe(0);
    expect(stats.averageRating).toBeNull();
  });
});
