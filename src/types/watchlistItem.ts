/**
 * WatchLog Data Model
 * -------------------
 * These types describe what a watchlist item looks like in our app.
 * We support two kinds: movies and books.
 */

/** Is this item a movie or a book? */
export type ItemType = 'movie' | 'book';

/**
 * Three-step status flow:
 *   Want → Watching (movies) / Reading (books) → Done
 */
export type WatchlistStatus = 'want' | 'watching' | 'reading' | 'done';

/** Star rating from 1 to 5. null means "not rated yet". */
export type StarRating = 1 | 2 | 3 | 4 | 5 | null;

/** Fields shared by every watchlist item (movie or book). */
export interface BaseWatchlistItem {
  /** Unique ID — we generate this when adding to the watchlist */
  id: string;
  title: string;
  genres: string[];
  status: WatchlistStatus;
  rating: StarRating;
  /** ISO date string, e.g. "2026-07-15" */
  dateAdded: string;
  /** Optional cover image URL */
  coverUrl?: string;
}

/** A movie in the watchlist */
export interface MovieItem extends BaseWatchlistItem {
  type: 'movie';
  releaseYear?: number;
  director?: string;
}

/** A book in the watchlist */
export interface BookItem extends BaseWatchlistItem {
  type: 'book';
  author?: string;
  publishYear?: number;
}

/** A watchlist item can be either a movie or a book */
export type WatchlistItem = MovieItem | BookItem;

/** Result from searching an external API (before adding to watchlist) */
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

/** Summary numbers for the whole watchlist */
export interface WatchlistStatistics {
  totalItems: number;
  movieCount: number;
  bookCount: number;
  wantCount: number;
  inProgressCount: number;
  doneCount: number;
  /** Percentage of items marked "done", 0–100 */
  completionRate: number;
  /** Average star rating of done items that have a rating. null if none rated. */
  averageRating: number | null;
}
