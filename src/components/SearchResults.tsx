import { useState } from 'react';
import type { SearchResult, WatchlistItem } from '../types/watchlistItem';

interface SearchResultsProps {
  results: SearchResult[];
  hasSearched: boolean;
  onAdd: (item: WatchlistItem) => void;
  onRemove: (id: string) => void;
  existingIds: string[];
}
function searchResultToWatchlistItem(result: SearchResult): WatchlistItem {
  const base = {
    id: `${result.type}-${result.externalId}`,
    title: result.title,
    genres: result.genres,
    status: 'want' as const,
    rating: null,
    dateAdded: new Date().toISOString().slice(0, 10),
    coverUrl: result.coverUrl,
  };

  if (result.type === 'movie') {
    return {
      ...base,
      type: 'movie',
      releaseYear: result.releaseYear,
      director: result.director,
    };
  }

  return {
    ...base,
    type: 'book',
    author: result.author,
    publishYear: result.publishYear,
  };
}

function SearchResults({ results, hasSearched, onAdd, onRemove, existingIds }: SearchResultsProps) {
  if (!hasSearched) {
    return null;
  }

  if (results.length === 0) {
    return (
      <section className="mb-8">
        <p className="text-md text-red-400">No results found. Try a different search.</p>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        Search results
      </h2>

      <ul className="flex flex-col gap-2">
        {results.map((result) => {
          const watchlistId = `${result.type}-${result.externalId}`;
          const alreadyAdded = existingIds.includes(watchlistId);

          const subtitle =
            result.type === 'movie'
              ? result.releaseYear?.toString() ?? 'Movie'
              : result.author ?? 'Book';

          return (
            <li
              key={watchlistId}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface-raised p-3"
            >
              <div className="h-14 w-10 shrink-0 overflow-hidden rounded bg-surface-overlay">
                {result.coverUrl ? (
                  <img
                    src={result.coverUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">
                    ?
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">{result.title}</p>
                <p className="truncate text-sm text-muted">{subtitle}</p>
              </div>

              <span
                className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold uppercase ${result.type === 'movie' ? 'bg-movie text-white' : 'bg-book text-white'
                  }`}
              >
                {result.type}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (alreadyAdded) {
                    onRemove(watchlistId);
                  } else {
                    onAdd(searchResultToWatchlistItem(result));
                  }
                }}
                className="shrink-0 rounded bg-accent px-2 py-0.4 text-sm font-medium text-white transition hover:bg-accent-hover"
              >
                {alreadyAdded ? 'Remove' : 'Add'}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default SearchResults;
