import { Link, useNavigate, useParams } from 'react-router-dom';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import RatingInput from '../components/RatingInput';
import { useWatchlist } from '../context/WatchlistContext';
import type { ItemType, WatchlistStatus } from '../types/watchlistItem';
import { btnDanger, cardStatusVariant, textLink, textMuted } from '../styles/ui';

function statusLabel(status: WatchlistStatus, type: ItemType): string {
  if (status === 'want') {
    return type === 'movie' ? 'Want to watch' : 'Want to read';
  }
  if (status === 'watching') return 'Watching';
  if (status === 'reading') return 'Reading';
  return 'Done';
}

function formatAddedDate(dateAdded: string): string {
  const parsed = new Date(`${dateAdded}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateAdded;

  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Shared layout only — never mix with conflicting bg/text utilities. */
const detailTagLayout =
  'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide';

const detailFact =
  'px-4 py-3.5 border border-border rounded-card bg-surface-raised/88';

const detailFactLabel =
  'm-0 text-muted text-xs font-semibold uppercase tracking-wider';

const detailFactValue = 'm-0 mt-1.5 text-base font-semibold text-foreground';

function DetailPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = rawId ? decodeURIComponent(rawId) : undefined;
  const navigate = useNavigate();
  const { items, updateItem, removeItem } = useWatchlist();

  const item = items.find((entry) => entry.id === id);

  if (!item) {
    return (
      <div className="p-page">
        <p className={textMuted}>Item not found.</p>
        <Link to="/watchlist" className={textLink}>
          Back to list
        </Link>
      </div>
    );
  }

  const year = item.type === 'movie' ? item.releaseYear : item.publishYear;
  const creator = item.type === 'movie' ? item.director : item.author;
  const creatorLabel = item.type === 'movie' ? 'Director' : 'Author';
  const yearLabel = item.type === 'movie' ? 'Release year' : 'Publish year';
  const statusText = statusLabel(item.status, item.type);
  const statusStyle = cardStatusVariant(item.status);

  const typeTagClass =
    item.type === 'movie'
      ? `${detailTagLayout} bg-movie text-white`
      : `${detailTagLayout} bg-book text-white`;

  return (
    <div className="relative overflow-hidden p-page">
      {item.coverUrl && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <img
            src={item.coverUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-top blur-[48px] saturate-110 opacity-[0.22] scale-[1.08]"
          />
          <div className="absolute inset-0 bg-linear-to-b from-surface from-0% via-transparent via-35% to-surface to-100%" />
        </div>
      )}

      <div className="relative z-1">
        <Link to="/watchlist" className={textLink}>
          ← Back to list
        </Link>

        <article className="grid grid-cols-[14rem_minmax(0,1fr)] max-[700px]:grid-cols-1 gap-8 max-[700px]:gap-5 items-start mt-6 max-w-3xl">
          <div className="sticky top-6 max-[700px]:static max-[700px]:max-w-48">
            {item.coverUrl ? (
              <img
                src={item.coverUrl}
                alt={item.title}
                className="w-full aspect-2/3 object-cover rounded-card border border-border bg-surface-overlay shadow-poster"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex items-center justify-center w-full aspect-2/3 rounded-card border border-border bg-surface-overlay shadow-poster text-muted text-sm">
                No cover
              </div>
            )}
          </div>

          <div className="min-w-0 pt-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={typeTagClass}>{item.type}</span>
              <span
                className={`${detailTagLayout} normal-case tracking-normal ${statusStyle.badge}`}
              >
                {statusText}
              </span>
            </div>

            <h1 className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight tracking-tight text-foreground">
              {item.title}
            </h1>

            {(creator || year != null) && (
              <p className="m-0 mt-2 text-[1.05rem] text-muted">
                {creator
                  ? `${item.type === 'movie' ? 'Directed by' : 'Written by'} ${creator}`
                  : null}
                {creator && year != null ? ' · ' : null}
                {year != null ? year : null}
              </p>
            )}

            {item.genres.length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-5">
                {item.genres.map((genre) => (
                  <li
                    key={genre}
                    className="px-3 py-1.5 rounded-button bg-accent-soft text-accent text-sm font-medium"
                  >
                    {genre}
                  </li>
                ))}
              </ul>
            )}

            <section
              className="grid grid-cols-2 max-[700px]:grid-cols-1 gap-3 mt-6"
              aria-label="Item details"
            >
              <div className={detailFact}>
                <p className={detailFactLabel}>Status</p>
                <p className={detailFactValue}>{statusText}</p>
              </div>

              <div className={detailFact}>
                <p className={detailFactLabel} id={`rating-label-${item.id}`}>
                  Rating
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <RatingInput
                    value={item.rating}
                    onChange={(rating) => updateItem(item.id, { rating })}
                    aria-labelledby={`rating-label-${item.id}`}
                  />
                  <span className="text-muted text-sm font-medium">
                    {item.rating !== null ? `${item.rating} / 5` : 'Not rated yet'}
                  </span>
                </div>
              </div>

              {year != null && (
                <div className={detailFact}>
                  <p className={detailFactLabel}>{yearLabel}</p>
                  <p className={detailFactValue}>{year}</p>
                </div>
              )}

              {creator && (
                <div className={detailFact}>
                  <p className={detailFactLabel}>{creatorLabel}</p>
                  <p className={detailFactValue}>{creator}</p>
                </div>
              )}

              <div className={`${detailFact} col-span-full`}>
                <p className={detailFactLabel}>Date added</p>
                <p className={detailFactValue}>{formatAddedDate(item.dateAdded)}</p>
              </div>
            </section>

            <div className="mt-7">
              <ConfirmDeleteDialog
                title="Remove from watchlist?"
                description={`“${item.title}” will be removed from your watchlist.`}
                confirmLabel="Remove"
                onConfirm={() => {
                  removeItem(item.id);
                  navigate('/watchlist');
                }}
                trigger={
                  <button type="button" className={btnDanger}>
                    Remove from watchlist
                  </button>
                }
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default DetailPage;
