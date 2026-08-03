import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { usePopular } from '../hooks/usePopular';
import { useSearch } from '../hooks/useSearch';
import { useWatchlist } from '../context/WatchlistContext';
import { useEffect, useState } from 'react';

/**
 * Search page.
 *
 * Step by step:
 * 1. Page opens → show popular titles
 * 2. User searches → show search results
 * 3. User clears search → show popular again
 */
function AddEditPage() {
  const search = useSearch();
  const popular = usePopular();
  const { items } = useWatchlist();

  // Have we searched yet?
  const didSearch = search.hasSearched;

  // Snapshot for this visit: filter when popular loads, not when user adds.
  const [popularForVisit, setPopularForVisit] = useState(popular.results);

  useEffect(() => {
    if (popular.loading) return;

    const savedIds = new Set(items.map((item) => item.id));
    setPopularForVisit(
      popular.results.filter((result) => {
        const id = result.type + '-' + result.externalId;
        return !savedIds.has(id);
      }),
    );
    // Intentionally omit `items`: re-filter only on popular fetch / page remount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popular.results, popular.loading]);

  return (
    <div className="page">
      <header className="page-header page-header--narrow">
        <h1 className="page-title">Discover your next obsession.</h1>
        <p className="page-subtitle">
          Search across movies and books, then add titles to your watchlist.
        </p>
      </header>

      <SearchBar
        onSearch={search.search}
        loading={search.loading}
        error={search.error}
      />

      {/* Show popular error only when we are still on the popular list */}
      {!didSearch && popular.error && (
        <p className="text-warn" role="status">
          {popular.error}
        </p>
      )}

      {didSearch ? (
        <SearchResults
          results={search.results}
          heading="Search results"
          emptyMessage="No results found. Try a different search."
          loading={search.loading}
        />
      ) : (
        <SearchResults
          results={popularForVisit}
          heading="Popular right now"
          emptyMessage="No popular titles available right now. Search for something new."
          loading={popular.loading}
        />
      )}
    </div>
  );
}

export default AddEditPage;
