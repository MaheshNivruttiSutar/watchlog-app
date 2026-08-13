import type { KeyboardEvent } from 'react';
import type { WatchlistItem } from '../types/watchlistItem';
import { badgeClass, cardStatusVariant } from '../styles/ui';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

interface WatchlistCardProps {
  item: WatchlistItem;
  onSelect?: (id: string) => void;
  onRemove: (id: string) => void;
}

const cardBase =
  'group relative w-44 overflow-hidden border-2 rounded-card bg-surface-raised shadow-card cursor-pointer transition-[border-color,box-shadow] duration-150 hover:shadow-card-hover focus-visible:outline-none focus-visible:shadow-focus';

function WatchlistCard({ item, onSelect, onRemove }: WatchlistCardProps) {
  const subtitle =
    item.type === 'movie'
      ? String(item.releaseYear || 'Movie')
      : item.author || 'Book';

  const statusStyle = cardStatusVariant(item.status);

  function openItem() {
    if (onSelect) onSelect(item.id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openItem();
    }
  }

  return (
    <article
      className={`${cardBase} ${statusStyle.card}`}
      tabIndex={0}
      role="link"
      aria-label={`Open ${item.title}`}
      onClick={openItem}
      onKeyDown={handleKeyDown}
    >
      <div className="relative aspect-2/3 bg-surface-overlay">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-muted">
            No cover
          </div>
        )}

        <span className={badgeClass('left', item.type)}>{item.type}</span>

        <div
          className="absolute top-2 right-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <ConfirmDeleteDialog
            title="Remove from watchlist?"
            description={`“${item.title}” will be removed from your watchlist.`}
            confirmLabel="Remove"
            onConfirm={() => onRemove(item.id)}
            trigger={
              <button
                type="button"
                className="px-2 py-1 border-0 rounded-button bg-surface-raised/95 text-xs font-medium text-danger cursor-pointer shadow-delete focus-visible:outline-none focus-visible:shadow-focus"
                aria-label={'Remove ' + item.title}
              >
                Delete
              </button>
            }
          />
        </div>
      </div>

      <div className="p-3">
        <h3 className="m-0 text-base font-semibold text-foreground truncate">
          {item.title}
        </h3>
        <p className="mt-1 mb-0 text-sm text-muted truncate">{subtitle}</p>
        <p
          className={`inline-flex items-center m-0 mt-2 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${statusStyle.badge}`}
        >
          {statusStyle.label}
        </p>
      </div>
    </article>
  );
}

export default WatchlistCard;
