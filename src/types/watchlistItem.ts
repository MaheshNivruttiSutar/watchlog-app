/**
 * Simple data shapes used in WatchLog.
 * Keep these flat — one object type, optional fields when needed.
 */

/** movie or book */
export type ItemType = 'movie' | 'book';

/** where the user is with this item */
export type WatchlistStatus = 'want' | 'watching' | 'reading' | 'done';

/** something saved in the user's watchlist */
export interface WatchlistItem {
  id: string;
  type: ItemType;
  title: string;
  genres: string[];
  status: WatchlistStatus;
  rating: number | null; // 1–5, or null if not rated
  dateAdded: string; // e.g. "2026-07-15"
  coverUrl?: string;
  // movie-only fields (optional)
  releaseYear?: number;
  director?: string;
  // book-only fields (optional)
  author?: string;
  publishYear?: number;
}

/** one result from the search / popular API (before saving) */
export interface SearchResult {
  externalId: string;
  type: ItemType;
  title: string;
  genres: string[];
  coverUrl?: string;
  releaseYear?: number;
  director?: string;
  author?: string;
  publishYear?: number;
}

/** numbers shown on the dashboard */
export interface WatchlistStatistics {
  totalItems: number;
  movieCount: number;
  bookCount: number;
  wantCount: number;
  inProgressCount: number;
  doneCount: number;
  completionRate: number;
  averageRating: number | null;
}
