import { config } from '../config.js';
import type { SearchResult } from '../types/watchlistItem.js';

export interface OpenLibraryDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  subject?: string[];
  cover_i?: number;
}

export interface TmdbMovie {
  id: number;
  title: string;
  release_date?: string;
  genre_ids?: number[];
  poster_path?: string;
}

/** Map TMDB genre IDs to readable names (common ones) */
export const TMDB_GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

/**
 * Open Library keys look like "/works/OL45804W".
 * Slashes break React Router's `/items/:id` (one path segment),
 * so turn them into a URL-safe id: "works-OL45804W".
 */
export function toUrlSafeExternalId(key: string): string {
  return key.replace(/^\//, '').replace(/\//g, '-');
}

export function mapOpenLibraryDocToSearchResult(
  doc: OpenLibraryDoc,
): SearchResult {
  const coverUrl = doc.cover_i
    ? `${config.openLibrary.coverBaseUrl}/${doc.cover_i}-M.jpg`
    : undefined;

  return {
    externalId: toUrlSafeExternalId(doc.key!),
    type: 'book',
    title: doc.title!,
    genres: (doc.subject ?? []).slice(0, 5),
    coverUrl,
    author: doc.author_name?.[0],
    publishYear: doc.first_publish_year,
  };
}

export function mapTmdbMovieToSearchResult(movie: TmdbMovie): SearchResult {
  const releaseYear = movie.release_date
    ? parseInt(movie.release_date.split('-')[0], 10)
    : undefined;

  const genres = (movie.genre_ids ?? [])
    .map((id) => TMDB_GENRE_MAP[id])
    .filter((name): name is string => name !== undefined);

  const coverUrl = movie.poster_path
    ? `${config.tmdb.imageBaseUrl}${movie.poster_path}`
    : undefined;

  return {
    externalId: String(movie.id),
    type: 'movie',
    title: movie.title,
    genres,
    coverUrl,
    releaseYear,
  };
}
