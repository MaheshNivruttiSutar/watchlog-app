import { describe, it, expect } from 'vitest';
import { groupByGenre } from '../utils/group.js';
import { mockWatchlist } from './mockData.js';

describe('groupByGenre', () => {
  it('groups items by genre', () => {
    const groups = groupByGenre(mockWatchlist);
    expect(groups['Sci-Fi']).toHaveLength(7);
    expect(groups['Action']).toHaveLength(2);
    expect(groups['Fantasy']).toHaveLength(1);
  });

  it('puts an item in multiple groups if it has multiple genres', () => {
    const groups = groupByGenre(mockWatchlist);
    const inception = groups['Sci-Fi'].find((i) => i.title === 'Inception');
    const actionGroup = groups['Action'].find((i) => i.title === 'Inception');
    expect(inception).toBeDefined();
    expect(actionGroup).toBeDefined();
  });

  it('returns empty object for empty watchlist', () => {
    const groups = groupByGenre([]);
    expect(groups).toEqual({});
  });
});
