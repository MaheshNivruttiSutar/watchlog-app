import {
  searchBooks,
  searchMovies,
  search,
  SearchApiError,
  isTransientSearchError,
} from '../api/search.js';

const originalFetch = globalThis.fetch;

function stubFetch() {
  globalThis.fetch = jest.fn() as typeof fetch;
}

function restoreFetch() {
  globalThis.fetch = originalFetch;
}

function mockedFetch() {
  return jest.mocked(fetch);
}

describe('searchBooks', () => {
  beforeEach(() => {
    stubFetch();
  });

  afterEach(() => {
    restoreFetch();
  });

  it('returns search results from Open Library', async () => {
    const mockResponse = {
      docs: [
        {
          key: '/works/OL45804W',
          title: 'The Hobbit',
          author_name: ['J.R.R. Tolkien'],
          first_publish_year: 1937,
          subject: ['Fantasy', 'Adventure'],
          cover_i: 12345,
        },
      ],
    };

    mockedFetch().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const results = await searchBooks('hobbit');

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('The Hobbit');
    expect(results[0].type).toBe('book');
    expect(results[0].externalId).toBe('works-OL45804W');
    expect(results[0].author).toBe('J.R.R. Tolkien');
    expect(results[0].genres).toEqual(['Fantasy', 'Adventure']);
  });

  it('returns empty array for empty query', async () => {
    const results = await searchBooks('   ');
    expect(results).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('throws SearchApiError on network failure', async () => {
    mockedFetch().mockRejectedValueOnce(new Error('Network down'));

    await expect(searchBooks('dune')).rejects.toThrow(
      'Network error while searching books',
    );
  });

  it('throws SearchApiError on non-OK response', async () => {
    mockedFetch().mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(searchBooks('dune')).rejects.toThrow(SearchApiError);
  });
});

describe('searchMovies', () => {
  const originalApiKey = process.env.TMDB_API_KEY;

  beforeEach(() => {
    stubFetch();
    process.env.TMDB_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    restoreFetch();
    process.env.TMDB_API_KEY = originalApiKey;
  });

  it('returns search results from TMDB', async () => {
    const mockResponse = {
      results: [
        {
          id: 27205,
          title: 'Inception',
          release_date: '2010-07-16',
          genre_ids: [28, 878],
          poster_path: '/poster.jpg',
        },
      ],
    };

    mockedFetch().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const results = await searchMovies('inception');

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Inception');
    expect(results[0].type).toBe('movie');
    expect(results[0].releaseYear).toBe(2010);
    expect(results[0].genres).toEqual(['Action', 'Sci-Fi']);
  });

  it('throws when TMDB API key is missing', async () => {
    process.env.TMDB_API_KEY = '';

    await expect(searchMovies('matrix')).rejects.toThrow(SearchApiError);
    await expect(searchMovies('matrix')).rejects.toThrow(
      'TMDB API key is not configured',
    );
  });
});

describe('isTransientSearchError', () => {
  it('retries network failures and 5xx / 429', () => {
    expect(
      isTransientSearchError(
        new SearchApiError('Network error while searching books', 'openLibrary'),
      ),
    ).toBe(true);
    expect(
      isTransientSearchError(
        new SearchApiError('TMDB returned status 500', 'tmdb', 500),
      ),
    ).toBe(true);
    expect(
      isTransientSearchError(
        new SearchApiError('TMDB returned status 429', 'tmdb', 429),
      ),
    ).toBe(true);
  });

  it('does not retry a missing key or a 4xx', () => {
    expect(
      isTransientSearchError(
        new SearchApiError(
          'TMDB API key is not configured. Set TMDB_API_KEY environment variable.',
          'tmdb',
        ),
      ),
    ).toBe(false);
    expect(
      isTransientSearchError(
        new SearchApiError('TMDB returned status 404', 'tmdb', 404),
      ),
    ).toBe(false);
  });
});

describe('search', () => {
  beforeEach(() => {
    stubFetch();
  });

  afterEach(() => {
    restoreFetch();
  });

  it('calls searchBooks when type is book', async () => {
    mockedFetch().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: [] }),
    } as Response);

    await search('test', 'book');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('openlibrary.org'),
    );
  });
});
