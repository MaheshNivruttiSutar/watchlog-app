import { describe, expect, it } from 'vitest';
import { SearchApiError } from '../api/search.js';
import { searchErrorMessage } from '../hooks/useTitleSearch.js';
import { queryKeys } from '../query/keys.js';

describe('queryKeys', () => {
  it('gives search a unique slot per query and type', () => {
    expect(queryKeys.search('dune', 'book')).toEqual(['search', 'book', 'dune']);
    expect(queryKeys.search('dune', 'movie')).not.toEqual(
      queryKeys.search('dune', 'book'),
    );
  });
});

describe('searchErrorMessage', () => {
  it('uses the Error message when present', () => {
    expect(
      searchErrorMessage(new SearchApiError('Network error', 'tmdb')),
    ).toBe('Network error');
  });
});
