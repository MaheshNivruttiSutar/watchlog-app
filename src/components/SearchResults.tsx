import { useWatchlist } from '../context/WatchlistContext';
import type { SearchResult, WatchlistItem } from '../types/watchlistItem';

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

function SearchResults({
  results,
  heading,
  emptyMessage = 'No results found. Try a different search.',
  loading = false,
}: SearchResultsProps) {
  const { items, addItem, removeItem } = useWatchlist();

  // 1) Still loading
  if (loading && results.length === 0) {
    return (
      <section>
        <h2 className="section-label">{heading}</h2>
        <p className="text-muted">Loading…</p>
      </section>
    );
  }

  // 2) Nothing to show
  if (results.length === 0) {
    return (
      <section className="empty-state">
        <p className="text-muted">{emptyMessage}</p>
      </section>
    );
  }

  // 3) Show the list
  return (
    <section>
      <h2 className="section-label">{heading}</h2>

      <ul className="search-results-grid">
        {results.map((result) => {
          const id = result.type + '-' + result.externalId;
          const alreadyAdded = items.some((item) => item.id === id);
          const subtitle =
            result.author ||
            (result.releaseYear ? String(result.releaseYear) : result.type);

          function handleClick() {
            if (alreadyAdded) {
              removeItem(id);
            } else {
              addItem(makeWatchlistItem(result));
            }
          }

          return (
            <li key={id} className="search-card">
              <div className="search-card-cover">
                {result.coverUrl ? (
                  <img src={result.coverUrl} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <div className="cover-fallback">No cover</div>
                )}
                <span
                  className={
                    result.type === 'movie'
                      ? 'badge badge-right badge-movie'
                      : 'badge badge-right badge-book'
                  }
                >
                  {result.type}
                </span>
              </div>

              <div className="search-card-body">
                <p className="search-card-title truncate">{result.title}</p>
                <p className="search-card-subtitle truncate">{subtitle}</p>

                <button
                  type="button"
                  onClick={handleClick}
                  className={
                    alreadyAdded
                      ? 'btn btn-danger search-card-action'
                      : 'btn btn-primary search-card-action'
                  }
                >
                  {alreadyAdded ? 'Remove' : 'Add to Watchlist'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default SearchResults;
