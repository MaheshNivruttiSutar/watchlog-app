import { useNavigate } from 'react-router-dom';
import WatchlistCard from './WatchlistCard';
import { useRemoveWatchlistItem } from '../hooks/useWatchlist';
import type { WatchlistItem } from '../types/watchlistItem';
import { textMuted } from '../styles/ui';

interface WatchlistGridProps {
  items: WatchlistItem[];
}

function WatchlistGrid({ items }: WatchlistGridProps) {
  const removeItem = useRemoveWatchlistItem();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="p-12 px-6 border border-dashed border-border rounded-card bg-surface-raised text-center">
        <p className={textMuted}>No items match these filters.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-card-gap">
      {items.map((item) => (
        <WatchlistCard
          key={item.id}
          item={item}
          onSelect={(id) => navigate(`/items/${encodeURIComponent(id)}`)}
          onRemove={(id) => removeItem.mutate(id)}
        />
      ))}
    </div>
  );
}

export default WatchlistGrid;
