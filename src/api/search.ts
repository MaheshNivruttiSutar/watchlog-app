import { config, getTmdbApiKey, isTmdbConfigured } from '../config.js';
import type { ItemType, SearchResult } from '../types/watchlistItem.js';
import {
  mapOpenLibraryDocToSearchResult,
  mapTmdbMovieToSearchResult,
  type OpenLibraryDoc,
  type TmdbMovie,
} from './mappers.js';

/** Custom error so callers know something went wrong with the API */
export class SearchApiError extends Error {
  constructor(
    message: string,
    public readonly source: 'tmdb' | 'openLibrary',
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'SearchApiError';
  }
}

interface OpenLibraryResponse {
  docs?: OpenLibraryDoc[];
}

function rethrowIfAborted(err: unknown): void {
  if (err instanceof DOMException && err.name === 'AbortError') {
    throw err;
  }
}

/**
 * Search for books using the free Open Library API.
 * No API key needed.
 */
export async function searchBooks(
  query: string,
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  const url = `${config.openLibrary.baseUrl}/search.json?title=${encodeURIComponent(query)}&limit=10`;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    rethrowIfAborted(err);
    throw new SearchApiError(
      'Network error while searching books',
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

  const data = (await response.json()) as OpenLibraryResponse;
  const docs = data.docs ?? [];

  return docs
    .filter((doc) => doc.title && doc.key)
    .map((doc) => mapOpenLibraryDocToSearchResult(doc));
}

interface TmdbSearchResponse {
  results?: TmdbMovie[];
}

/**
 * Search for movies using the TMDB API.
 * Requires TMDB_API_KEY environment variable.
 */
export async function searchMovies(
  query: string,
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  if (!isTmdbConfigured()) {
    throw new SearchApiError(
      'TMDB API key is not configured. Set TMDB_API_KEY environment variable.',
      'tmdb',
    );
  }

  const url = `${config.tmdb.baseUrl}/search/movie?api_key=${getTmdbApiKey()}&query=${encodeURIComponent(query)}`;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    rethrowIfAborted(err);
    throw new SearchApiError(
      'Network error while searching movies',
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

  const data = (await response.json()) as TmdbSearchResponse;
  const results = data.results ?? [];

  return results.map((movie) => mapTmdbMovieToSearchResult(movie));
}

/**
 * Search by type — books or movies.
 * This is the main function other stages will call.
 */
export async function search(
  query: string,
  type: ItemType,
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  if (type === 'book') {
    return searchBooks(query, signal);
  }
  return searchMovies(query, signal);
}
