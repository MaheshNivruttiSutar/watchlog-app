import { useState, type FormEvent } from 'react';
import type { ItemType } from '../types/watchlistItem';

interface SearchBarProps {
  onSearch: (query: string, type: ItemType) => void;
  loading: boolean;
  error: string | null;
}

function SearchBar({ onSearch, loading, error }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<ItemType>('book');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch(query, type);
  }

  function clearSearch() {
    setQuery('');
    onSearch('', type);
  }

  const inactiveToggleClass =
    'bg-surface-raised text-muted hover:text-foreground border-border border';

  return (
    <section className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex min-w-64 flex-1 flex-col gap-1">
          <label htmlFor="search-query" className="text-m text-muted">
            Search
          </label>
          <div className="relative">
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                if (!value.trim()) {
                  onSearch('', type);
                }
              }}
              placeholder={type === 'book' ? 'Search Books...' : 'Search Movies...'}
              className="h-10 w-full rounded-lg border border-border bg-surface-raised py-2 pl-3 pr-9 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-muted transition hover:bg-surface-overlay hover:text-foreground"
              >
                X
              </button>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-end gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-m text-muted">Choose Type:</span>
            <div className="flex h-10 rounded-lg border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setType('book');
                  if (!query.trim()) onSearch('', 'book');
                }}
                className={`h-full px-4 text-sm font-medium transition cursor-pointer ${type === 'book'
                  ? 'bg-book text-foreground'
                  : inactiveToggleClass
                  }`}
              >
                Book
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('movie');
                  if (!query.trim()) onSearch('', 'movie');
                }}
                className={`h-full px-4 text-sm font-medium transition cursor-pointer ${type === 'movie'
                  ? 'bg-movie text-foreground'
                  : inactiveToggleClass
                  }`}
              >
                Movie
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted invisible select-none" aria-hidden="true">
              Search
            </span>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="h-10 w-28 shrink-0 rounded-lg bg-accent px-4 cursor-pointer text-sm font-medium text-foreground transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>
      {error && (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

export default SearchBar;
