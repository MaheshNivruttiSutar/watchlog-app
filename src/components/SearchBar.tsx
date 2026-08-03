import { useState, type FormEvent } from 'react';
import type { ItemType } from '../types/watchlistItem';

interface SearchBarProps {
  onSearch: (query: string, type: ItemType) => void;
  loading: boolean;
  error: string | null;
}

function SearchBar({ onSearch, loading, error }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<ItemType>('movie');

  function handleSubmit(e: FormEvent) {
    e.preventDefault(); // stop the browser from refreshing the page
    onSearch(query, type);
  }

  function clearSearch() {
    setQuery('');
    onSearch('', type);
  }

  return (
    <section className="search-section">
      <form onSubmit={handleSubmit}>
        <div className="search-row">
          <div className="search-input-wrap">
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Titles, authors, directors..."
              className="search-input"
            />
            {query !== '' && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="search-clear"
              >
                X
              </button>
            )}
          </div>

          <div className="type-chips">
            <button
              type="button"
              onClick={() => setType('movie')}
              className={type === 'movie' ? 'type-chip active' : 'type-chip'}
            >
              Movies
            </button>
            <button
              type="button"
              onClick={() => setType('book')}
              className={type === 'book' ? 'type-chip active' : 'type-chip'}
            >
              Books
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || query.trim() === ''}
            className="btn btn-primary btn-search"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <p className="text-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

export default SearchBar;
