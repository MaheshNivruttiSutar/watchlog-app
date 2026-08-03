import { Link, useNavigate, useParams } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import type { ItemType, WatchlistStatus } from '../types/watchlistItem';

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

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="detail-stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? 'detail-star detail-star--on' : 'detail-star'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

function DetailPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = rawId ? decodeURIComponent(rawId) : undefined;
  const navigate = useNavigate();
  const { items, removeItem } = useWatchlist();

  const item = items.find((entry) => entry.id === id);

  if (!item) {
    return (
      <div className="page">
        <p className="text-muted">Item not found.</p>
        <Link to="/watchlist" className="text-link">
          Back to list
        </Link>
      </div>
    );
  }

  const year =
    item.type === 'movie' ? item.releaseYear : item.publishYear;
  const creator =
    item.type === 'movie' ? item.director : item.author;
  const creatorLabel = item.type === 'movie' ? 'Director' : 'Author';
  const yearLabel = item.type === 'movie' ? 'Release year' : 'Publish year';
  const statusText = statusLabel(item.status, item.type);

  return (
    <div className="page detail-page">
      {item.coverUrl && (
        <div
          className="detail-backdrop"
          style={{ backgroundImage: `url(${item.coverUrl})` }}
          aria-hidden="true"
        />
      )}

      <div className="detail-page-inner">
        <Link to="/watchlist" className="text-link">
          ← Back to list
        </Link>

        <article className="detail-layout">
          <div className="detail-cover-wrap">
            {item.coverUrl ? (
              <img
                src={item.coverUrl}
                alt={item.title}
                className="detail-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="detail-cover detail-cover--fallback">No cover</div>
            )}
          </div>

          <div className="detail-body">
            <div className="detail-tags">
              <span
                className={
                  item.type === 'movie'
                    ? 'detail-tag detail-tag--movie'
                    : 'detail-tag detail-tag--book'
                }
              >
                {item.type}
              </span>
              <span className="detail-tag detail-tag--status">{statusText}</span>
            </div>

            <h1 className="detail-title">{item.title}</h1>

            {(creator || year != null) && (
              <p className="detail-subtitle">
                {creator ? `${item.type === 'movie' ? 'Directed by' : 'Written by'} ${creator}` : null}
                {creator && year != null ? ' · ' : null}
                {year != null ? year : null}
              </p>
            )}

            {item.genres.length > 0 && (
              <ul className="detail-genres">
                {item.genres.map((genre) => (
                  <li key={genre}>{genre}</li>
                ))}
              </ul>
            )}

            <section className="detail-facts" aria-label="Item details">
              <div className="detail-fact">
                <p className="detail-fact-label">Status</p>
                <p className="detail-fact-value">{statusText}</p>
              </div>

              <div className="detail-fact">
                <p className="detail-fact-label">Rating</p>
                <p className="detail-fact-value">
                  {item.rating !== null ? (
                    <>
                      <StarRating rating={item.rating} />
                      <span className="detail-rating-inline">{item.rating} / 5</span>
                    </>
                  ) : (
                    <span className="text-muted">Not rated yet</span>
                  )}
                </p>
              </div>

              {year != null && (
                <div className="detail-fact">
                  <p className="detail-fact-label">{yearLabel}</p>
                  <p className="detail-fact-value">{year}</p>
                </div>
              )}

              {creator && (
                <div className="detail-fact">
                  <p className="detail-fact-label">{creatorLabel}</p>
                  <p className="detail-fact-value">{creator}</p>
                </div>
              )}

              <div className="detail-fact detail-fact--wide">
                <p className="detail-fact-label">Date added</p>
                <p className="detail-fact-value">{formatAddedDate(item.dateAdded)}</p>
              </div>
            </section>

            <button
              type="button"
              className="btn btn-danger detail-remove"
              onClick={() => {
                removeItem(item.id);
                navigate('/watchlist');
              }}
            >
              Remove from watchlist
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

export default DetailPage;
