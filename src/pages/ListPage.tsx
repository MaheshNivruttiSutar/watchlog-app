import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useTranslation } from 'react-i18next';
import WatchlistGrid from '../components/WatchlistGrid';
import { useWatchlistQuery } from '../hooks/useWatchlist';
import { useUiStore } from '../store/uiStore';
import { chipToggleItem } from '../styles/ui';
import { getFilteredWatchlistItems } from '../utils/watchlistView';

function ListPage() {
  const { t } = useTranslation();
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
          <h1 className="m-0 text-3xl font-bold text-foreground">
            {t('list.title')}
          </h1>
          <p className="mt-1 text-muted">{t('list.subtitle')}</p>
        </div>
      </div>

      <ToggleGroup.Root
        type="single"
        value={listType}
        onValueChange={(next) => {
          if (next !== 'all' && next !== 'movie' && next !== 'book') return;
          setListType(next);
        }}
        aria-label={t('list.filterByType')}
        className="flex flex-wrap gap-2 mb-4"
      >
        <ToggleGroup.Item value="all" className={chipToggleItem}>
          {t('status.all')}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="movie" className={chipToggleItem}>
          {t('media.movies')}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="book" className={chipToggleItem}>
          {t('media.books')}
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
        aria-label={t('list.filterByStatus')}
        className="flex flex-wrap gap-2 mb-8"
      >
        <ToggleGroup.Item value="all" className={chipToggleItem}>
          {t('status.all')}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="want" className={chipToggleItem}>
          {t('status.want')}
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="watching"
          disabled={watchingDisabled}
          className={chipToggleItem}
        >
          {t('status.watching')}
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="reading"
          disabled={readingDisabled}
          className={chipToggleItem}
        >
          {t('status.reading')}
        </ToggleGroup.Item>
        <ToggleGroup.Item value="done" className={chipToggleItem}>
          {t('status.done')}
        </ToggleGroup.Item>
      </ToggleGroup.Root>

      <WatchlistGrid items={filteredItems}>
        {(item) => (
          <WatchlistGrid.Card key={item.id} item={item}>
            <WatchlistGrid.Cover>
              <WatchlistGrid.Remove />
            </WatchlistGrid.Cover>
            <WatchlistGrid.Meta />
          </WatchlistGrid.Card>
        )}
      </WatchlistGrid>
    </div>
  );
}

export default ListPage;
