import { useEffect, useState } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import type { WatchlistItem } from '../types/watchlistItem';

const panelClassName =
  'w-80 shrink-0 rounded-xl border border-border bg-surface-raised p-8';

function formatStatus(status: WatchlistItem['status']): string {
  const labels: Record<WatchlistItem['status'], string> = {
    want: 'Want',
    watching: 'Watching',
    reading: 'Reading',
    done: 'Completed',
  };
  return labels[status];
}

function DetailPanel() {
  const { selectedItem, removeItem } = useWatchlist();
  const [coverFailed, setCoverFailed] = useState(false);

  useEffect(() => {
    setCoverFailed(false);
  }, [selectedItem?.id]);

  if (!selectedItem) {
    return (
      <aside className={panelClassName}>
        <div className="mb-4 flex aspect-2/3 items-center justify-center rounded-lg bg-surface-overlay">
          <p className="px-4 text-center text-muted">Click a card to see details</p>
        </div>
      </aside>
    );
  }

  const subtitle =
    selectedItem.type === 'movie'
      ? selectedItem.releaseYear?.toString() ?? 'Movie'
      : selectedItem.author ?? 'Book';

  const showCover = selectedItem.coverUrl && !coverFailed;

  return (
    <aside className={panelClassName}>
      <div className="relative mb-4 aspect-2/3 overflow-hidden rounded-lg bg-surface-overlay">
        {showCover ? (
          <img
            src={selectedItem.coverUrl}
            alt={selectedItem.title}
            referrerPolicy="no-referrer"
            onError={() => setCoverFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No cover
          </div>
        )}
      </div>

      <span
        className={`inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase ${
          selectedItem.type === 'movie' ? 'bg-movie text-white' : 'bg-book text-white'
        }`}
      >
        {selectedItem.type}
      </span>

      <h2 className="mt-2 text-xl font-bold text-white">{selectedItem.title}</h2>
      <p className="text-muted">{subtitle}</p>

      {selectedItem.type === 'movie' && selectedItem.director && (
        <p className="mt-1 text-sm text-muted">Director: {selectedItem.director}</p>
      )}

      {selectedItem.type === 'book' && selectedItem.publishYear && (
        <p className="mt-1 text-sm text-muted">Published: {selectedItem.publishYear}</p>
      )}

      <p className="mt-3 text-sm text-muted">
        Genres: {selectedItem.genres.join(', ')}
      </p>

      <p className="mt-2 text-sm">
        Status:{' '}
        <span className="text-accent">{formatStatus(selectedItem.status)}</span>
      </p>

      {selectedItem.rating !== null && (
        <p className="mt-1 text-sm text-yellow-500">
          Rating: {'★'.repeat(selectedItem.rating)}
        </p>
      )}

      <p className="mt-1 text-xs text-muted">Added: {selectedItem.dateAdded}</p>

      <button
        type="button"
        onClick={() => removeItem(selectedItem.id)}
        className="mt-4 text-sm text-red-400 hover:underline"
      >
        Remove from watchlist
      </button>
    </aside>
  );
}

export default DetailPanel;
