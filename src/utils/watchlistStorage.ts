import type {
  ItemType,
  WatchlistItem,
  WatchlistStatus,
} from '../types/watchlistItem';

export const WATCHLIST_STORAGE_KEY = 'watchlog-watchlist';

function isItemType(value: unknown): value is ItemType {
  return value === 'movie' || value === 'book';
}

function isWatchlistStatus(value: unknown): value is WatchlistStatus {
  return (
    value === 'want' ||
    value === 'watching' ||
    value === 'reading' ||
    value === 'done'
  );
}

function isRating(value: unknown): value is number | null {
  if (value === null) return true;
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 5
  );
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === 'string';
}

function isOptionalNumber(value: unknown): boolean {
  return value === undefined || typeof value === 'number';
}

function isWatchlistItem(value: unknown): value is WatchlistItem {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'type' in value &&
    isItemType(value.type) &&
    'title' in value &&
    typeof value.title === 'string' &&
    'genres' in value &&
    Array.isArray(value.genres) &&
    value.genres.every((genre) => typeof genre === 'string') &&
    'status' in value &&
    isWatchlistStatus(value.status) &&
    'rating' in value &&
    isRating(value.rating) &&
    'dateAdded' in value &&
    typeof value.dateAdded === 'string' &&
    isOptionalString('coverUrl' in value ? value.coverUrl : undefined) &&
    isOptionalNumber('releaseYear' in value ? value.releaseYear : undefined) &&
    isOptionalString('director' in value ? value.director : undefined) &&
    isOptionalString('author' in value ? value.author : undefined) &&
    isOptionalNumber('publishYear' in value ? value.publishYear : undefined)
  );
}

/**
 * Read the saved watchlist. Returns null when missing or unusable
 * so the caller can fall back to seed data.
 */
export function loadWatchlist(): WatchlistItem[] | null {
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isWatchlistItem)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveWatchlist(items: WatchlistItem[]): void {
  localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));
}
