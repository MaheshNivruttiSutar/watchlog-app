/**
 * Main entry point — re-exports everything for easy importing.
 *
 * Later stages (React UI) will import from here:
 *   import { filterByStatus, searchBooks, type WatchlistItem } from 'watchlog';
 */

// Types
export type {
  ItemType,
  WatchlistStatus,
  WatchlistItem,
  SearchResult,
  WatchlistStatistics,
} from './types/watchlistItem.js';

// Config
export { config, getTmdbApiKey, isTmdbConfigured } from './config.js';

// Filter utilities
export {
  filterByStatus,
  filterByType,
  filterByGenre,
} from './utils/filter.js';

// Sort utilities
export { sortByRating, sortByDateAdded } from './utils/sort.js';

// Group utilities
export { groupByGenre } from './utils/group.js';

// Statistics
export { calculateStatistics } from './utils/statistics.js';

// API search
export {
  search,
  searchBooks,
  searchMovies,
  SearchApiError,
} from './api/search.js';

// API popular
export {
  getPopularMovies,
  getPopularBooks,
  getPopularContent,
} from './api/popular.js';