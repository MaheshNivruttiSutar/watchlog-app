import { describe, expect, it } from 'vitest';
import {
  searchCleared,
  searchFailed,
  searchReducer,
  searchRequested,
  searchSucceeded,
  type SearchState,
} from '../store/searchSlice.js';

const idle: SearchState = {
  results: [],
  loading: false,
  error: null,
  hasSearched: false,
};

describe('searchSlice', () => {
  it('sets loading when a search is requested', () => {
    const next = searchReducer(
      idle,
      searchRequested({ query: 'Dune', type: 'book' }),
    );
    expect(next.loading).toBe(true);
    expect(next.error).toBeNull();
  });

  it('stores results on success', () => {
    const result = {
      externalId: '1',
      type: 'book' as const,
      title: 'Dune',
      genres: [],
    };
    const next = searchReducer(
      { ...idle, loading: true },
      searchSucceeded([result]),
    );
    expect(next.loading).toBe(false);
    expect(next.hasSearched).toBe(true);
    expect(next.results).toEqual([result]);
  });

  it('stores an error on failure', () => {
    const next = searchReducer(
      { ...idle, loading: true },
      searchFailed('Network error'),
    );
    expect(next.loading).toBe(false);
    expect(next.hasSearched).toBe(true);
    expect(next.results).toEqual([]);
    expect(next.error).toBe('Network error');
  });

  it('resets when the search is cleared', () => {
    const next = searchReducer(
      {
        results: [
          {
            externalId: '1',
            type: 'movie',
            title: 'Dune',
            genres: [],
          },
        ],
        loading: true,
        error: 'oops',
        hasSearched: true,
      },
      searchCleared(),
    );
    expect(next).toEqual(idle);
  });
});
