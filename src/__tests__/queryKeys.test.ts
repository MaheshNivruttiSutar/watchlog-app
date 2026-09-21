import { SearchApiError } from '../api/search.js';
import { getSearchErrorKey } from '../hooks/useTitleSearch.js';
import { queryKeys } from '../query/keys.js';

describe('queryKeys', () => {
  it('gives search a unique slot per query and type', () => {
    expect(queryKeys.search('dune', 'book')).toEqual(['search', 'book', 'dune']);
    expect(queryKeys.search('dune', 'movie')).not.toEqual(
      queryKeys.search('dune', 'book'),
    );
  });
});

describe('getSearchErrorKey', () => {
  it('maps technical failures to translatable message keys', () => {
    expect(
      getSearchErrorKey(
        new SearchApiError('Network error while searching movies', 'tmdb'),
      ),
    ).toBe('errors.network');
    expect(
      getSearchErrorKey(
        new SearchApiError('TMDB API key is not configured', 'tmdb'),
      ),
    ).toBe('errors.tmdbNotConfigured');
    expect(getSearchErrorKey(new Error('Unexpected failure'))).toBe(
      'errors.searchFailed',
    );
  });
});
