import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useState, type FormEvent } from 'react';
import type { ItemType } from '../types/watchlistItem';
import { btnPrimary, btnSearch, typeChipToggleItem } from '../styles/ui';

interface SearchBarProps {
  onSearch: (query: string, type: ItemType) => void;
  loading: boolean;
  error: string | null;
}

function SearchBar({ onSearch, loading, error }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<ItemType>('movie');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch(query, type);
  }

  function clearSearch() {
    setQuery('');
    onSearch('', type);
  }

  return (
    <section className="mb-10">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-64">
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Titles, authors, directors..."
              aria-label="Search titles, authors, or directors"
              className="box-border w-full h-control pr-10 pl-4 border border-border rounded-control bg-surface-raised text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-focus"
            />
            {query !== '' && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 flex items-center justify-center w-7 h-7 border-0 rounded-button bg-transparent text-muted -translate-y-1/2 cursor-pointer hover:bg-surface-overlay hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus"
              >
                X
              </button>
            )}
          </div>

          <ToggleGroup.Root
            type="single"
            value={type}
            onValueChange={(next) => {
              // Keep a type selected — ignore clear-on-reclick from Radix.
              if (next === 'movie' || next === 'book') setType(next);
            }}
            aria-label="Search media type"
            className="flex gap-2"
          >
            <ToggleGroup.Item value="movie" className={typeChipToggleItem}>
              Movies
            </ToggleGroup.Item>
            <ToggleGroup.Item value="book" className={typeChipToggleItem}>
              Books
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          <button
            type="submit"
            disabled={loading || query.trim() === ''}
            className={`${btnPrimary} ${btnSearch}`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

export default SearchBar;
