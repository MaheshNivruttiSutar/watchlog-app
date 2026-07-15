import type { WatchlistItem } from '../types/watchlistItem.js';

/**
 * Realistic mock data for unit tests.
 * A small watchlist with movies and books in different statuses.
 */
export const mockWatchlist: WatchlistItem[] = [
  {
    id: '1',
    type: 'movie',
    title: 'Inception',
    genres: ['Sci-Fi', 'Action'],
    status: 'done',
    rating: 5,
    dateAdded: '2026-01-10',
    releaseYear: 2010,
    director: 'Christopher Nolan',
    coverUrl: 'https://example.com/inception.jpg',
  },
  {
    id: '2',
    type: 'movie',
    title: 'The Matrix',
    genres: ['Sci-Fi', 'Action'],
    status: 'watching',
    rating: null,
    dateAdded: '2026-02-15',
    releaseYear: 1999,
    coverUrl: 'https://example.com/matrix.jpg',
  },
  {
    id: '3',
    type: 'book',
    title: 'Dune',
    genres: ['Sci-Fi', 'Adventure'],
    status: 'done',
    rating: 4,
    dateAdded: '2026-01-20',
    author: 'Frank Herbert',
    publishYear: 1965,
  },
  {
    id: '4',
    type: 'book',
    title: '1984',
    genres: ['Dystopian', 'Fiction'],
    status: 'reading',
    rating: null,
    dateAdded: '2026-03-01',
    author: 'George Orwell',
    publishYear: 1949,
  },
  {
    id: '5',
    type: 'movie',
    title: 'Interstellar',
    genres: ['Sci-Fi', 'Drama'],
    status: 'want',
    rating: null,
    dateAdded: '2026-04-05',
    releaseYear: 2014,
    director: 'Christopher Nolan',
  },
  {
    id: '6',
    type: 'book',
    title: 'The Hobbit',
    genres: ['Fantasy', 'Adventure'],
    status: 'want',
    rating: null,
    dateAdded: '2026-05-12',
    author: 'J.R.R. Tolkien',
    publishYear: 1937,
  },
  {
    id: '7',
    type: 'movie',
    title: 'Blade Runner 2049',
    genres: ['Sci-Fi', 'Drama'],
    status: 'done',
    rating: 4,
    dateAdded: '2026-02-28',
    releaseYear: 2017,
  },
];

export const emptyWatchlist: WatchlistItem[] = [];
