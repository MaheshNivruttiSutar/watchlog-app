import type { WatchlistItem } from '../types/watchlistItem';

interface WatchlistCardProps {
  item: WatchlistItem;
  onSelect?: (id: string) => void;
  onRemove: (id: string) => void;
}

function WatchlistCard({ item, onSelect, onRemove }: WatchlistCardProps) {
  // Small text under the title
  const subtitle =
    item.type === 'movie'
      ? String(item.releaseYear || 'Movie')
      : item.author || 'Book';

  return (
    <article
      className="watch-card"
      onClick={() => {
        if (onSelect) onSelect(item.id);
      }}
    >
      <div className="watch-card-cover">
        {item.coverUrl ? (
          <img src={item.coverUrl} alt={item.title} referrerPolicy="no-referrer" />
        ) : (
          <div className="cover-fallback">No cover</div>
        )}

        <span
          className={
            item.type === 'movie'
              ? 'badge badge-left badge-movie'
              : 'badge badge-left badge-book'
          }
        >
          {item.type}
        </span>

        <button
          type="button"
          className="watch-card-delete"
          aria-label={'Remove ' + item.title}
          onClick={(e) => {
            e.stopPropagation(); // don't open the card when deleting
            onRemove(item.id);
          }}
        >
          Delete
        </button>
      </div>

      <div className="watch-card-body">
        <h3 className="watch-card-title truncate">{item.title}</h3>
        <p className="watch-card-subtitle truncate">{subtitle}</p>
        <p className="status-row">{item.status}</p>
      </div>
    </article>
  );
}

export default WatchlistCard;
