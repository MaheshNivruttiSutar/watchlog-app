import * as ToggleGroup from '@radix-ui/react-toggle-group';
import WatchlistGrid from '../components/WatchlistGrid';
import { useWatchlistQuery } from '../hooks/useWatchlist';
import { useUiStore } from '../store/uiStore';
import { chipToggleItem } from '../styles/ui';
import { getFilteredWatchlistItems } from '../utils/watchlistView';

function ListPage() {
  const listType = useUiStore((state) => state.listType);
  const listStatus = useUiStore((state) => state.listStatus);
  const setListType = useUiStore((state) => state.setListType);
  const setListStatus = useUiStore((state) => state.setListStatus);
  const readingDisabled = listType === 'movie';
  const watchingDisabled = listType === 'book';

  const watchlist = useWatchlistQuery();
  const filteredItems = getFilteredWatchlistItems(
    watchlist.data ?? [],
    listType,
    listStatus,
  );

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
        value={listType}
        onValueChange={(next) => {
          if (next !== 'all' && next !== 'movie' && next !== 'book') return;
          setListType(next);
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
        value={listStatus}
        onValueChange={(next) => {
          if (
            next === 'all' ||
            next === 'want' ||
            next === 'watching' ||
            next === 'reading' ||
            next === 'done'
          ) {
            setListStatus(next);
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
