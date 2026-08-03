import { useNavigate } from 'react-router-dom';
import WatchlistCard from './WatchlistCard';
import { useWatchlist } from '../context/WatchlistContext';
import type { WatchlistItem } from '../types/watchlistItem';

interface WatchlistGridProps {
  items?: WatchlistItem[];
}

function WatchlistGrid({ items: itemsProp }: WatchlistGridProps) {
  const { items: allItems, removeItem } = useWatchlist();
  const items = itemsProp ?? allItems;
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p className="text-muted">No items match these filters.</p>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {items.map((item) => (
        <WatchlistCard
          key={item.id}
          item={item}
          onSelect={(id) => navigate(`/items/${encodeURIComponent(id)}`)}
          onRemove={removeItem}
        />
      ))}
    </div>
  );
}

export default WatchlistGrid;
