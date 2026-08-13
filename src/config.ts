/**
 * Central config — all environment variables live here.
 * TMDB (movies) needs a free API key. Open Library (books) does not.
 *
 * Browser (Vite): set VITE_TMDB_API_KEY in .env
 * Node (tests/scripts): set TMDB_API_KEY in .env — loaded via vitest.config / scripts
 */

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
  // Node (vitest, live script): use process.env — import.meta.env is Vite-only
  if (typeof process !== 'undefined' && process.versions?.node) {
    return process.env.TMDB_API_KEY ?? '';
  }

  // Browser (Vite): only VITE_* vars are exposed
  const viteKey = import.meta.env?.VITE_TMDB_API_KEY;
  if (viteKey) {
    return viteKey;
  }

  return '';
}

/** Returns true if TMDB movie search is available (API key is set). */
export function isTmdbConfigured(): boolean {
  return getTmdbApiKey().length > 0;
}
