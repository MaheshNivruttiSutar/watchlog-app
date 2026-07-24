import type { WatchlistItem } from '../types/watchlistItem';

interface WatchlistCardProps {
  item: WatchlistItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onRemove: (id: string) => void;
}

function formatStatus(status: WatchlistItem['status']): string {
  const labels: Record<WatchlistItem['status'], string> = {
    want: 'Want',
    watching: 'Watching',
    reading: 'Reading',
    done: 'Completed',
  };
  return labels[status];
}

function WatchlistCard({ item, isSelected = false, onSelect, onRemove }: WatchlistCardProps) {
  const subtitle =
    item.type === 'movie'
      ? item.releaseYear?.toString() ?? 'Movie'
      : item.author ?? 'Book';

  return (
    <article
      onClick={() => onSelect?.(item.id)}
      className={`w-43 cursor-pointer overflow-hidden rounded-xl border bg-surface-raised transition ${isSelected ? 'border-accent' : 'border-border hover:border-accent/50'
        }`}
    >
      {/* Cover */}
      <div className="relative aspect-2/3 bg-surface-overlay">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted text-sm">
            No cover
          </div>
        )}

        {/* Type badge */}
        <span
          className={`absolute left-2 top-2 rounded px-2 py-0.5 text-xs font-semibold uppercase ${item.type === 'movie' ? 'bg-movie text-white' : 'bg-book text-white'
            }`}
        >
          {item.type}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="truncate font-semibold text-white">{item.title}</h3>
        <p className="mt-1 truncate text-sm text-muted">{subtitle}</p>

        <div className="mt-2 flex items-center justify-between">
          <span className="rounded bg-surface-overlay px-0.5 py-0.5 font-semibold text-xs text-accent">
            {formatStatus(item.status)}
          </span>

          {item.rating !== null && (
            <span className="text-xs text-yellow-500">
              {'★'.repeat(item.rating)}
            </span>
          )}
        </div>
        <button
          type="button"
          className="mt-2 text-xs text-red-400 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
        >
          Remove
        </button>
      </div>
    </article>
  );
}

export default WatchlistCard;