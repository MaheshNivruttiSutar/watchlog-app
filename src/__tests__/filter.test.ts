import { describe, it, expect } from 'vitest';
import {
  filterByStatus,
  filterByType,
  filterByGenre,
} from '../utils/filter.js';
import { mockWatchlist } from './mockData.js';

describe('filterByStatus', () => {
  it('returns only items with the given status', () => {
    const done = filterByStatus(mockWatchlist, 'done');
    expect(done).toHaveLength(3);
    expect(done.every((item) => item.status === 'done')).toBe(true);
  });

  it('returns want items', () => {
    const want = filterByStatus(mockWatchlist, 'want');
    expect(want).toHaveLength(2);
    expect(want.map((i) => i.title)).toEqual(['Interstellar', 'The Hobbit']);
  });

  it('returns empty array when no items match', () => {
    const result = filterByStatus([], 'done');
    expect(result).toEqual([]);
  });
});

describe('filterByType', () => {
  it('returns only movies', () => {
    const movies = filterByType(mockWatchlist, 'movie');
    expect(movies).toHaveLength(4);
    expect(movies.every((item) => item.type === 'movie')).toBe(true);
  });

  it('returns only books', () => {
    const books = filterByType(mockWatchlist, 'book');
    expect(books).toHaveLength(3);
    expect(books.every((item) => item.type === 'book')).toBe(true);
  });
});

describe('filterByGenre', () => {
  it('finds items with matching genre (case-insensitive)', () => {
    const sciFi = filterByGenre(mockWatchlist, 'sci-fi');
    expect(sciFi).toHaveLength(5);
  });

  it('finds items with Fantasy genre', () => {
    const fantasy = filterByGenre(mockWatchlist, 'Fantasy');
    expect(fantasy).toHaveLength(1);
    expect(fantasy[0].title).toBe('The Hobbit');
  });

  it('returns empty array when genre not found', () => {
    const result = filterByGenre(mockWatchlist, 'Horror');
    expect(result).toEqual([]);
  });
});
