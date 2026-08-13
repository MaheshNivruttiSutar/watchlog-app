import { useWatchlist } from '../context/WatchlistContext';
import type { SearchResult, WatchlistItem } from '../types/watchlistItem';
import { badgeClass, btnDanger, btnPrimary, textMuted } from '../styles/ui';

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

const searchCardAction = 'mt-auto w-full shrink-0 whitespace-nowrap';

function SearchResults({
  results,
  heading,
  emptyMessage = 'No results found. Try a different search.',
  loading = false,
}: SearchResultsProps) {
  const { items, addItem, removeItem } = useWatchlist();

  if (loading && results.length === 0) {
    return (
      <section>
        <h2 className={sectionLabel}>{heading}</h2>
        <p className={textMuted}>Loading…</p>
      </section>
    );
  }

  if (results.length === 0) {
    return (
      <section className="p-12 px-6 border border-dashed border-border rounded-card bg-surface-raised text-center">
        <p className={textMuted}>{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className={sectionLabel}>{heading}</h2>

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-card-gap">
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
            <li
              key={id}
              className="flex flex-col overflow-hidden border border-border rounded-card bg-surface-raised shadow-card"
            >
              <div className="relative aspect-2/3 bg-surface-overlay">
                {result.coverUrl ? (
                  <img
                    src={result.coverUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted">
                    No cover
                  </div>
                )}
                <span className={badgeClass('right', result.type)}>{result.type}</span>
              </div>

              <div className="flex flex-1 flex-col p-3 gap-1">
                <p className="m-0 font-semibold text-foreground truncate">
                  {result.title}
                </p>
                <p className="m-0 text-sm text-muted truncate">{subtitle}</p>

                <button
                  type="button"
                  onClick={handleClick}
                  className={
                    alreadyAdded
                      ? `${btnDanger} ${searchCardAction}`
                      : `${btnPrimary} ${searchCardAction}`
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
