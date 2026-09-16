import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { usePopular } from '../hooks/usePopular';
import { searchErrorMessage, useTitleSearch } from '../hooks/useTitleSearch';
import { useWatchlistQuery } from '../hooks/useWatchlist';
import type { ItemType, SearchResult } from '../types/watchlistItem';

function AddEditPage() {
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [submittedType, setSubmittedType] = useState<ItemType>('movie');
  const [hasSearched, setHasSearched] = useState(false);

  const search = useTitleSearch(submittedQuery, submittedType, hasSearched);
  const popular = usePopular();
  const watchlist = useWatchlistQuery();
  const items = watchlist.data ?? [];

  function handleSearch(query: string, type: ItemType) {
    if (!query.trim()) {
      setHasSearched(false);
      setSubmittedQuery('');
      return;
    }

    setSubmittedType(type);
    setSubmittedQuery(query.trim());
    setHasSearched(true);
  }

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

  const searchError = search.isError ? searchErrorMessage(search.error) : null;
  const popularError =
    popular.isError ? searchErrorMessage(popular.error) : null;

  return (
    <div className="p-page">
      <header className="mb-8 max-w-3xl">
        <h1 className="m-0 text-3xl font-bold text-foreground">
          Discover your next obsession.
        </h1>
        <p className="mt-1 text-muted">
          Search across movies and books, then add titles to your watchlist.
        </p>
      </header>

      <SearchBar
        onSearch={handleSearch}
        loading={search.isFetching}
        error={searchError}
      />

      {!hasSearched && popularError && (
        <p className="mb-4 text-sm text-warning" role="status">
          {popularError}
        </p>
      )}

      {hasSearched ? (
        <SearchResults
          results={search.data ?? []}
          heading="Search results"
          emptyMessage="No results found. Try a different search."
          loading={search.isFetching}
        />
      ) : (
        <SearchResults
          results={popularForVisit}
          heading="Popular right now"
          emptyMessage="No popular titles available right now. Search for something new."
          loading={popular.isPending}
        />
      )}
    </div>
  );
}

export default AddEditPage;
