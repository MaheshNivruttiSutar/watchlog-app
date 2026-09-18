import {
  createContext,
  useContext,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import type { WatchlistItem } from '../types/watchlistItem';
import { badgeClass, cardStatusVariant } from '../styles/ui';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

interface WatchlistCardContextValue {
  item: WatchlistItem;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

const WatchlistCardContext = createContext<WatchlistCardContextValue | null>(
  null,
);

export const WatchlistGridActionsContext = createContext<{
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
} | null>(null);

export function useWatchlistCard(): WatchlistCardContextValue {
  const context = useContext(WatchlistCardContext);
  if (!context) {
    throw new Error(
      'WatchlistGrid card parts must be rendered inside WatchlistGrid.Card',
    );
  }
  return context;
}

const cardBase =
  'group relative w-44 overflow-hidden border-2 rounded-card bg-surface-raised shadow-card cursor-pointer transition-[border-color,box-shadow] duration-150 hover:shadow-card-hover focus-visible:outline-none focus-visible:shadow-focus';

interface WatchlistCardProps {
  item: WatchlistItem;
  children: ReactNode;
}

function WatchlistCard({ item, children }: WatchlistCardProps) {
  const { t } = useTranslation();
  const actions = useContext(WatchlistGridActionsContext);
  if (!actions) {
    throw new Error('WatchlistGrid.Card must be rendered inside WatchlistGrid');
  }

  const { onSelect, onRemove } = actions;
  const statusStyle = cardStatusVariant(item.status);

  function openItem() {
    onSelect(item.id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openItem();
    }
  }

  return (
    <WatchlistCardContext.Provider value={{ item, onSelect, onRemove }}>
      <article
        className={`${cardBase} ${statusStyle.card}`}
        tabIndex={0}
        role="link"
        aria-label={t('card.open', { title: item.title })}
        onClick={openItem}
        onKeyDown={handleKeyDown}
      >
        {children}
      </article>
    </WatchlistCardContext.Provider>
  );
}

function WatchlistCardCover({ children }: { children?: ReactNode }) {
  const { t } = useTranslation();
  const { item } = useWatchlistCard();

  return (
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
          {t('common.noCover')}
        </div>
      )}

      <span className={badgeClass('left', item.type)}>
        {t(`media.${item.type}`)}
      </span>

      {children}
    </div>
  );
}

function WatchlistCardMeta() {
  const { t } = useTranslation();
  const { item } = useWatchlistCard();
  const statusStyle = cardStatusVariant(item.status);
  const subtitle =
    item.type === 'movie'
      ? String(item.releaseYear || t('media.movie'))
      : item.author || t('media.book');

  return (
    <div className="p-3">
      <h3 className="m-0 text-base font-semibold text-foreground truncate">
        {item.title}
      </h3>
      <p className="mt-1 mb-0 text-sm text-muted truncate">{subtitle}</p>
      <p
        className={`inline-flex items-center m-0 mt-2 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${statusStyle.badge}`}
      >
        {t(`status.${item.status}`)}
      </p>
    </div>
  );
}

function WatchlistCardRemove() {
  const { t } = useTranslation();
  const { item, onRemove } = useWatchlistCard();

  return (
    <div
      className="absolute top-2 right-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <ConfirmDeleteDialog
        title={t('detail.removeTitle')}
        description={t('detail.removeDescription', { title: item.title })}
        confirmLabel={t('common.remove')}
        onConfirm={() => onRemove(item.id)}
        trigger={
          <button
            type="button"
            className="px-2 py-0.5 border-0 rounded bg-danger text-xs font-semibold uppercase text-surface cursor-pointer transition-[background] duration-150 hover:bg-danger-hover shadow-delete focus-visible:outline-none focus-visible:shadow-focus"
            aria-label={t('card.remove', { title: item.title })}
          >
            {t('common.remove')}
          </button>
        }
      />
    </div>
  );
}

export {
  WatchlistCard,
  WatchlistCardCover,
  WatchlistCardMeta,
  WatchlistCardRemove,
};
