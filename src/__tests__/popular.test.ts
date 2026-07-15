import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getPopularMovies,
  getPopularBooks,
  getPopularContent,
} from '../api/popular.js';
import { SearchApiError } from '../api/search.js';

describe('getPopularMovies', () => {
  const originalApiKey = process.env.TMDB_API_KEY;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    process.env.TMDB_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.TMDB_API_KEY = originalApiKey;
  });

  it('returns popular movies from TMDB', async () => {
    const mockResponse = {
      results: [
        {
          id: 550,
          title: 'Fight Club',
          release_date: '1999-10-15',
          genre_ids: [18],
          poster_path: '/poster.jpg',
        },
        {
          id: 27205,
          title: 'Inception',
          release_date: '2010-07-16',
          genre_ids: [28, 878],
          poster_path: '/inception.jpg',
        },
      ],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const results = await getPopularMovies(2);

    expect(results).toHaveLength(2);
    expect(results[0].title).toBe('Fight Club');
    expect(results[0].type).toBe('movie');
    expect(results[1].title).toBe('Inception');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/movie/popular'),
    );
  });

  it('throws when TMDB API key is missing', async () => {
    process.env.TMDB_API_KEY = '';

    await expect(getPopularMovies()).rejects.toThrow(SearchApiError);
  });
});

describe('getPopularBooks', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns trending books from Open Library', async () => {
    const mockResponse = {
      works: [
        {
          key: '/works/OL45804W',
          title: 'The Hobbit',
          author_name: ['J.R.R. Tolkien'],
          first_publish_year: 1937,
          cover_i: 12345,
        },
      ],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const results = await getPopularBooks(10);

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('The Hobbit');
    expect(results[0].type).toBe('book');
    expect(results[0].author).toBe('J.R.R. Tolkien');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('trending/now.json'),
    );
  });

  it('throws SearchApiError on network failure', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network down'));

    await expect(getPopularBooks()).rejects.toThrow(
      'Network error while fetching popular books',
    );
  });
});

describe('getPopularContent', () => {
  const originalApiKey = process.env.TMDB_API_KEY;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    process.env.TMDB_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.TMDB_API_KEY = originalApiKey;
  });

  it('returns movies and books together', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ id: 1, title: 'Movie A', genre_ids: [28] }],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          works: [{ key: '/works/OL1W', title: 'Book A', author_name: ['Author'] }],
        }),
      } as Response);

    const { movies, books } = await getPopularContent(1);

    expect(movies).toHaveLength(1);
    expect(movies[0].type).toBe('movie');
    expect(books).toHaveLength(1);
    expect(books[0].type).toBe('book');
  });
});
