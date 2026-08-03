import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  searchBooks,
  searchMovies,
  search,
  SearchApiError,
} from '../api/search.js';

describe('searchBooks', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

    vi.mocked(fetch).mockResolvedValueOnce({
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
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network down'));

    await expect(searchBooks('dune')).rejects.toThrow(
      'Network error while searching books',
    );
  });

  it('throws SearchApiError on non-OK response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(searchBooks('dune')).rejects.toThrow(SearchApiError);
  });
});

describe('searchMovies', () => {
  const originalApiKey = process.env.TMDB_API_KEY;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    process.env.TMDB_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

    vi.mocked(fetch).mockResolvedValueOnce({
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

describe('search', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls searchBooks when type is book', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: [] }),
    } as Response);

    await search('test', 'book');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('openlibrary.org'),
    );
  });
});
