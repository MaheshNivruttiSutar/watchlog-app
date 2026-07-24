import WatchlistCard from './WatchlistCard';
import { useWatchlist } from '../context/WatchlistContext';

function WatchlistGrid() {
  const { items, selectedId, selectItem, removeItem } = useWatchlist();

  if (items.length === 0) {
    return (
      <p className="text-muted">No items yet. Search for something and add it to your watchlist.</p>
    );
  }

  return (
    <div className="flex flex-1 flex-wrap justify-start gap-5">
      {items.map((item) => (
        <WatchlistCard
          key={item.id}
          item={item}
          isSelected={item.id === selectedId}
          onSelect={selectItem}
          onRemove={removeItem}
        />
      ))}
    </div>
  );
}

export default WatchlistGrid;
