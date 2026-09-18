import { useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  WatchlistCard,
  WatchlistCardCover,
  WatchlistCardMeta,
  WatchlistCardRemove,
  WatchlistGridActionsContext,
} from './WatchlistCard';
import { useRemoveWatchlistItem } from '../hooks/useWatchlist';
import type { WatchlistItem } from '../types/watchlistItem';
import { textMuted } from '../styles/ui';

interface WatchlistGridProps {
  items: WatchlistItem[];
  empty?: ReactNode;
  children: (item: WatchlistItem) => ReactNode;
}

function WatchlistGrid({ items, empty, children }: WatchlistGridProps) {
  const { t } = useTranslation();
  const removeItem = useRemoveWatchlistItem();
  const navigate = useNavigate();

  const onSelect = useCallback(
    (id: string) => {
      navigate(`/items/${encodeURIComponent(id)}`);
    },
    [navigate],
  );

  const onRemove = useCallback(
    (id: string) => {
      removeItem.mutate(id);
    },
    [removeItem],
  );

  if (items.length === 0) {
    return (
      empty ?? (
        <div className="p-12 px-6 border border-dashed border-border rounded-card bg-surface-raised text-center">
          <p className={textMuted}>{t('list.empty')}</p>
        </div>
      )
    );
  }

  return (
    <WatchlistGridActionsContext.Provider value={{ onSelect, onRemove }}>
      <div className="flex flex-wrap gap-card-gap">
        {items.map((item) => children(item))}
      </div>
    </WatchlistGridActionsContext.Provider>
  );
}

WatchlistGrid.Card = WatchlistCard;
WatchlistGrid.Cover = WatchlistCardCover;
WatchlistGrid.Meta = WatchlistCardMeta;
WatchlistGrid.Remove = WatchlistCardRemove;

export default WatchlistGrid;
