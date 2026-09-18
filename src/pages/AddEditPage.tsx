import { Profiler, useCallback, useDeferredValue, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/SearchBar';
import SearchProfileHud from '../components/SearchProfileHud';
import SearchResults from '../components/SearchResults';
import {
  countRender,
  isProfileBaseline,
  onSearchProfilerRender,
} from '../debug/renderCounts';
import { usePopular } from '../hooks/usePopular';
import { getSearchErrorKey, useTitleSearch } from '../hooks/useTitleSearch';
import { useWatchlistQuery } from '../hooks/useWatchlist';
import type { ItemType, SearchResult } from '../types/watchlistItem';

const EMPTY_RESULTS: SearchResult[] = [];

function AddEditPage() {
  countRender('AddEditPage');
  const { t } = useTranslation();
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [submittedType, setSubmittedType] = useState<ItemType>('movie');
  const hasSearched = submittedQuery.length > 0;

  const search = useTitleSearch(submittedQuery, submittedType, hasSearched);
  const searchResults = search.data ?? EMPTY_RESULTS;
  const deferredSearchResults = useDeferredValue(searchResults);
  const resultsForUi = isProfileBaseline()
    ? searchResults
    : deferredSearchResults;
  const popular = usePopular();
  const watchlist = useWatchlistQuery();
  const items = watchlist.data ?? [];

  const handleSearch = useCallback((query: string, type: ItemType) => {
    if (!query.trim()) {
      setSubmittedQuery('');
      return;
    }

    setSubmittedType(type);
    setSubmittedQuery(query.trim());
  }, []);

  const [popularForVisit, setPopularForVisit] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (popular.isPending) return;

    const savedIds = new Set(items.map((item) => item.id));
    setPopularForVisit(
      (popular.data ?? []).filter((result) => {
        const id = result.type + '-' + result.externalId;
        return !savedIds.has(id);
      }),
    );
    // Intentionally omit `items`: re-filter only on popular fetch / page remount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popular.data, popular.isPending]);

  const searchError = search.isError ? t(getSearchErrorKey(search.error)) : null;
  const popularError =
    popular.isError ? t(getSearchErrorKey(popular.error)) : null;

  return (
    <div className="p-page">
      <header className="mb-8 max-w-3xl">
        <h1 className="m-0 text-3xl font-bold text-foreground">
          {t('search.title')}
        </h1>
        <p className="mt-1 text-muted">{t('search.subtitle')}</p>
      </header>

      <Profiler id="SearchBar" onRender={onSearchProfilerRender}>
        <SearchBar
          onSearch={handleSearch}
          loading={search.isFetching}
          error={searchError}
        />
      </Profiler>

      {!hasSearched && popularError && (
        <p className="mb-4 text-sm text-warning" role="status">
          {popularError}
        </p>
      )}

      <Profiler id="SearchResults" onRender={onSearchProfilerRender}>
        {hasSearched ? (
          <SearchResults
            results={resultsForUi}
            heading={t('search.results')}
            emptyMessage={t('search.noResults')}
            loading={search.isFetching || resultsForUi !== searchResults}
          />
        ) : (
          <SearchResults
            results={popularForVisit}
            heading={t('search.popular')}
            emptyMessage={t('search.noPopular')}
            loading={popular.isPending}
          />
        )}
      </Profiler>

      <SearchProfileHud />
    </div>
  );
}

export default AddEditPage;
