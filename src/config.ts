/**
 * Central config — all environment variables live here.
 * TMDB (movies) needs a free API key. Open Library (books) does not.
 */

import dotenv from 'dotenv';

// Load variables from .env file in the project root
dotenv.config();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';

export const config = {
  tmdb: {
    baseUrl: TMDB_BASE_URL,
    imageBaseUrl: 'https://image.tmdb.org/t/p/w200',
  },
  openLibrary: {
    baseUrl: OPEN_LIBRARY_BASE_URL,
    coverBaseUrl: 'https://covers.openlibrary.org/b/id',
  },
} as const;

/** Read API key at call time so tests and runtime env changes work. */
export function getTmdbApiKey(): string {
  return process.env.TMDB_API_KEY ?? '';
}

/** Returns true if TMDB movie search is available (API key is set). */
export function isTmdbConfigured(): boolean {
  return getTmdbApiKey().length > 0;
}
