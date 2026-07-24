/**
 * Quick live test — run with: npm run test:live
 * Checks if book + movie APIs return real data.
 */

import 'dotenv/config';
import { searchBooks, searchMovies } from '../dist/api/search.js';
import { getPopularContent } from '../dist/api/popular.js';
import { isTmdbConfigured } from '../dist/config.js';

function printResult(label, items) {
  console.log(`\n✅ ${label} — ${items.length} result(s)`);
  if (items[0]) {
    const first = items[0];
    console.log('   First hit:', first.title);
    console.log('   Type:', first.type);
    console.log('   Genres:', first.genres.join(', ') || '(none)');
    if (first.coverUrl) console.log('   Cover:', first.coverUrl);
  }
}

function printError(label, err) {
  console.log(`\n❌ ${label} — FAILED`);
  console.log('   Message:', err.message);
  if (err.source) console.log('   Source:', err.source);
  if (err.statusCode) console.log('   HTTP status:', err.statusCode);
}

console.log('WatchLog — Live API Test');
console.log('========================');
console.log('TMDB key configured:', isTmdbConfigured() ? 'yes' : 'no');

try {
  const books = await searchBooks('hobbit');
  printResult('Book search (Open Library)', books);
} catch (err) {
  printError('Book search (Open Library)', err);
}

try {
  const movies = await searchMovies('inception');
  printResult('Movie search (TMDB)', movies);
} catch (err) {
  printError('Movie search (TMDB)', err);
}

try {
  const { movies, books } = await getPopularContent(10);
  printResult('Popular movies (TMDB)', movies);
  printResult('Popular books (Open Library)', books);
} catch (err) {
  printError('Popular content', err);
}

console.log('\nDone.');
