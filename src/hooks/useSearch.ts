import { useEffect, useRef, useState } from 'react';
import { search, SearchApiError } from '../api/search';
import type { ItemType, SearchResult } from '../types/watchlistItem';

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  async function runSearch(query: string, type: ItemType) {
    const trimmed = query.trim();

    abortControllerRef.current?.abort();

    if (!trimmed) {
      abortControllerRef.current = null;
      setResults([]);
      setError(null);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await search(trimmed, type, controller.signal);
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }

      setResults([]);

      if (err instanceof SearchApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
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
