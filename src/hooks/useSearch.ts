import { useState } from 'react';
import { search, SearchApiError } from '../api/search';
import type { ItemType, SearchResult } from '../types/watchlistItem';

/**
 * useSearch = remember search results in state.
 *
 * User clicks Search → we call the API → we save results here.
 */
export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function runSearch(query: string, type: ItemType) {
    // Empty text → leave "search mode" and show popular again
    if (!query.trim()) {
      setResults([]);
      setError(null);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await search(query.trim(), type);
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      setResults([]);
      setHasSearched(true);
      setError(
        err instanceof SearchApiError
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    results,
    hasSearched,
    loading,
    error,
    search: runSearch,
  };
}
