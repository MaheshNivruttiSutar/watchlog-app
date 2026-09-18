import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAddWatchlistItem,
  useRemoveWatchlistItem,
  useWatchlistQuery,
} from '../hooks/useWatchlist';
import type { SearchResult, WatchlistItem } from '../types/watchlistItem';
import { countRender, isProfileBaseline } from '../debug/renderCounts';
import { textMuted } from '../styles/ui';
import SearchResultCard from './SearchResultCard';

interface SearchResultsProps {
  results: SearchResult[];
  heading: string;
  emptyMessage?: string;
  loading?: boolean;
}

/** Convert API result → watchlist item we can save */
function makeWatchlistItem(result: SearchResult): WatchlistItem {
  return {
    id: result.type + '-' + result.externalId,
    type: result.type,
    title: result.title,
    genres: result.genres,
    status: 'want',
    rating: null,
    dateAdded: new Date().toISOString().slice(0, 10),
    coverUrl: result.coverUrl,
    releaseYear: result.releaseYear,
    director: result.director,
    author: result.author,
    publishYear: result.publishYear,
  };
}

const sectionLabel =
  'm-0 mb-4 text-sm font-semibold uppercase tracking-wider text-muted';

const EMPTY_WATCHLIST: WatchlistItem[] = [];

function SearchResults({
  results,
  heading,
  emptyMessage,
  loading = false,
}: SearchResultsProps) {
  countRender('SearchResults');
  const { t } = useTranslation();
  const watchlist = useWatchlistQuery();
  const { mutate: addItem } = useAddWatchlistItem();
  const { mutate: removeItem } = useRemoveWatchlistItem();
  const items = watchlist.data ?? EMPTY_WATCHLIST;
  const savedIds = useMemo(
    () => new Set(items.map((item) => item.id)),
    [items],
  );

  const handleAdd = useCallback(
    (result: SearchResult) => {
      addItem(makeWatchlistItem(result));
    },
    [addItem],
  );

  const handleRemove = useCallback(
    (id: string) => {
      removeItem(id);
    },
    [removeItem],
  );

  if (loading && results.length === 0) {
    return (
      <section>
        <h2 className={sectionLabel}>{heading}</h2>
        <p className={textMuted}>{t('common.loading')}</p>
      </section>
    );
  }

  if (results.length === 0) {
    return (
      <section className="p-12 px-6 border border-dashed border-border rounded-card bg-surface-raised text-center">
        <p className={textMuted}>{emptyMessage ?? t('search.noResults')}</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className={sectionLabel}>{heading}</h2>

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-card-gap">
        {results.map((result) => {
          const id = result.type + '-' + result.externalId;
          return (
            <SearchResultCard
              key={id}
              result={result}
              alreadyAdded={savedIds.has(id)}
              onAdd={handleAdd}
              onRemove={handleRemove}
            />
          );
        })}
      </ul>
    </section>
  );
}

const MemoSearchResults = memo(SearchResults);

export default function SearchResultsExport(props: SearchResultsProps) {
  if (isProfileBaseline()) {
    return <SearchResults {...props} />;
  }
  return <MemoSearchResults {...props} />;
}
