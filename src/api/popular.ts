import { config, getTmdbApiKey, isTmdbConfigured } from '../config.js';
import {
  mapOpenLibraryDocToSearchResult,
  mapTmdbMovieToSearchResult,
  type OpenLibraryDoc,
  type TmdbMovie,
} from './mappers.js';
import { SearchApiError } from './search.js';
import type { SearchResult } from '../types/watchlistItem.js';

interface TmdbPopularResponse {
  results?: TmdbMovie[];
}

interface OpenLibraryTrendingResponse {
  works?: OpenLibraryDoc[];
}

const DEFAULT_LIMIT = 10;

/**
 * Fetch popular movies from TMDB (homepage on load).
 * Requires TMDB_API_KEY in .env.
 */
export async function getPopularMovies(
  limit: number = DEFAULT_LIMIT,
): Promise<SearchResult[]> {
  if (!isTmdbConfigured()) {
    throw new SearchApiError(
      'TMDB API key is not configured. Set TMDB_API_KEY environment variable.',
      'tmdb',
    );
  }

  const url = `${config.tmdb.baseUrl}/movie/popular?api_key=${getTmdbApiKey()}&language=en-US&page=1`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new SearchApiError(
      'Network error while fetching popular movies',
      'tmdb',
    );
  }

  if (!response.ok) {
    throw new SearchApiError(
      `TMDB returned status ${response.status}`,
      'tmdb',
      response.status,
    );
  }

  const data = (await response.json()) as TmdbPopularResponse;
  const results = data.results ?? [];

  return results
    .slice(0, limit)
    .map((movie) => mapTmdbMovieToSearchResult(movie));
}

/**
 * Fetch trending books from Open Library (homepage on load).
 * No API key needed.
 */
export async function getPopularBooks(
  limit: number = DEFAULT_LIMIT,
): Promise<SearchResult[]> {
  const url = `${config.openLibrary.baseUrl}/trending/now.json?limit=${limit}`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new SearchApiError(
      'Network error while fetching popular books',
      'openLibrary',
    );
  }

  if (!response.ok) {
    throw new SearchApiError(
      `Open Library returned status ${response.status}`,
      'openLibrary',
      response.status,
    );
  }

  const data = (await response.json()) as OpenLibraryTrendingResponse;
  const works = data.works ?? [];

  return works
    .filter((work) => work.title && work.key)
    .slice(0, limit)
    .map((work) => mapOpenLibraryDocToSearchResult(work));
}

/**
 * Fetch popular movies and books in parallel (10 + 10 by default).
 * Use this on initial page load in Stage 2.
 */
export async function getPopularContent(
  limit: number = DEFAULT_LIMIT,
): Promise<{ movies: SearchResult[]; books: SearchResult[] }> {
  const [movies, books] = await Promise.all([
    getPopularMovies(limit),
    getPopularBooks(limit),
  ]);

  return { movies, books };
}
