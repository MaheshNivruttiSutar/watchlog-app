import { useEffect, useState } from 'react';
import { getPopularBooks, getPopularMovies } from '../api/popular';
import type { SearchResult } from '../types/watchlistItem';

/**
 * usePopular = load popular movies + books when the page opens.
 *
 * useEffect with [] means: "run this once on first render".
 */
export function usePopular() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const movies = await getPopularMovies(10);
        const books = await getPopularBooks(10);
        setResults([...movies, ...books]);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Could not load popular titles.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { results, loading, error };
}