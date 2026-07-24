import { describe, it, expect } from 'vitest';
import { sortByRating, sortByDateAdded } from '../utils/sort.js';
import { mockWatchlist } from './mockData.js';

describe('sortByRating', () => {
  it('sorts by rating descending (highest first)', () => {
    const doneItems = mockWatchlist.filter((i) => i.status === 'done');
    const sorted = sortByRating(doneItems, 'desc');
    const ratings = sorted.map((i) => i.rating);
    expect(ratings).toEqual([5, 4, 4, 3]);
  });

  it('sorts by rating ascending (lowest first)', () => {
    const doneItems = mockWatchlist.filter((i) => i.status === 'done');
    const sorted = sortByRating(doneItems, 'asc');
    const ratings = sorted.map((i) => i.rating);
    expect(ratings).toEqual([3, 4, 4, 5]);
  });

  it('puts unrated items at the end when sorting desc', () => {
    const sorted = sortByRating(mockWatchlist, 'desc');
    const ratedItems = sorted.filter((i) => i.rating !== null);
    const unratedItems = sorted.filter((i) => i.rating === null);
    const lastRatedPosition = sorted.indexOf(ratedItems[ratedItems.length - 1]);
    const firstUnratedPosition = sorted.indexOf(unratedItems[0]);
    expect(firstUnratedPosition).toBeGreaterThan(lastRatedPosition);
  });
});

describe('sortByDateAdded', () => {
  it('sorts by date descending (newest first)', () => {
    const sorted = sortByDateAdded(mockWatchlist, 'desc');
    expect(sorted[0].title).toBe('Everything Everywhere All at Once');
    expect(sorted[sorted.length - 1].title).toBe('Inception');
  });

  it('sorts by date ascending (oldest first)', () => {
    const sorted = sortByDateAdded(mockWatchlist, 'asc');
    expect(sorted[0].title).toBe('Inception');
    expect(sorted[sorted.length - 1].title).toBe('Everything Everywhere All at Once');
  });
});
