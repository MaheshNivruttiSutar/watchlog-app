import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useState } from 'react';
import WatchlistGrid from '../components/WatchlistGrid';
import { useWatchlist } from '../context/WatchlistContext';
import { calculateStatistics } from '../utils/statistics';
import { chipToggleItem } from '../styles/ui';
import type { ItemType, WatchlistStatus } from '../types/watchlistItem';

function ListPage() {
  const { items } = useWatchlist();
  const [type, setType] = useState<ItemType | 'all'>('all');
  const [status, setStatus] = useState<WatchlistStatus | 'all'>('all');
  const readingDisabled = type === 'movie';
  const watchingDisabled = type === 'book';

  const stats = calculateStatistics(items);

  const filteredItems = items.filter((item) => {
    const typeOk = type === 'all' || item.type === type;
    const statusOk = status === 'all' || item.status === status;
    return typeOk && statusOk;
  });

  return (
    <div className="p-page">
      <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="m-0 text-3xl font-bold text-foreground">Your Watchlist</h1>
          <p className="mt-1 text-muted">
            Track what you want, what you&apos;re into, and what you&apos;ve finished.
          </p>
        </div>
      </div>

      <ToggleGroup.Root
        type="single"
        value={type}
        onValueChange={(next) => {
          if (next !== 'all' && next !== 'movie' && next !== 'book') return;

          setType(next);

          if (next === 'movie' && status === 'reading') setStatus('all');
          if (next === 'book' && status === 'watching') setStatus('all');
        }}
        aria-label="Filter by type"
        className="flex flex-wrap gap-2 mb-4"
      >
        <ToggleGroup.Item value="all" className={chipToggleItem}>
          All
        </ToggleGroup.Item>
        <ToggleGroup.Item value="movie" className={chipToggleItem}>
          Movies
        </ToggleGroup.Item>
        <ToggleGroup.Item value="book" className={chipToggleItem}>
          Books
        </ToggleGroup.Item>
      </ToggleGroup.Root>

      <ToggleGroup.Root
        type="single"
        value={status}
        onValueChange={(next) => {
          if (
            next === 'all' ||
            next === 'want' ||
            next === 'watching' ||
            next === 'reading' ||
            next === 'done'
          ) {
            setStatus(next);
          }
        }}
        aria-label="Filter by status"
        className="flex flex-wrap gap-2 mb-8"
      >
        <ToggleGroup.Item value="all" className={chipToggleItem}>
          All
        </ToggleGroup.Item>
        <ToggleGroup.Item value="want" className={chipToggleItem}>
          Want
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="watching"
          disabled={watchingDisabled}
          className={chipToggleItem}
        >
          Watching
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="reading"
          disabled={readingDisabled}
          className={chipToggleItem}
        >
          Reading
        </ToggleGroup.Item>
        <ToggleGroup.Item value="done" className={chipToggleItem}>
          Done
        </ToggleGroup.Item>
      </ToggleGroup.Root>

      <WatchlistGrid items={filteredItems} />
    </div>
  );
}

export default ListPage;
