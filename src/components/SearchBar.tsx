import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useEffect, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SEARCH_DEBOUNCE_MS,
  useDebouncedValue,
} from '../hooks/useDebouncedValue';
import { useUiStore } from '../store/uiStore';
import type { ItemType } from '../types/watchlistItem';
import { countRender, isProfileBaseline } from '../debug/renderCounts';
import { typeChipToggleItem } from '../styles/ui';

interface SearchBarProps {
  onSearch: (query: string, type: ItemType) => void;
  loading: boolean;
  error: string | null;
}

function SearchBar({ onSearch, loading, error }: SearchBarProps) {
  countRender('SearchBar');
  const { t } = useTranslation();
  const query = useUiStore((state) => state.searchQuery);
  const type = useUiStore((state) => state.searchType);
  const setSearchQuery = useUiStore((state) => state.setSearchQuery);
  const setSearchType = useUiStore((state) => state.setSearchType);
  const clearSearchQuery = useUiStore((state) => state.clearSearchQuery);
  const debounceMs = isProfileBaseline() ? 0 : SEARCH_DEBOUNCE_MS;
  const debouncedQuery = useDebouncedValue(query, debounceMs);

  useEffect(() => {
    onSearch(debouncedQuery, type);
  }, [debouncedQuery, onSearch, type]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // Submitting is explicit, so do not make the user wait for the debounce.
    onSearch(query, type);
  }

  function clearSearch() {
    clearSearchQuery();
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              aria-label={t('search.inputLabel')}
              className="box-border w-full h-control pr-10 pl-4 border border-border rounded-control bg-surface-raised text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-focus"
            />
            {query !== '' && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label={t('search.clear')}
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
              if (next === 'movie' || next === 'book') setSearchType(next);
            }}
            aria-label={t('search.mediaType')}
            className="flex gap-2"
          >
            <ToggleGroup.Item value="movie" className={typeChipToggleItem}>
              {t('media.movies')}
            </ToggleGroup.Item>
            <ToggleGroup.Item value="book" className={typeChipToggleItem}>
              {t('media.books')}
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          {loading ? (
            <p className="m-0 text-sm text-muted" role="status">
              {t('search.submitting')}
            </p>
          ) : null}
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
