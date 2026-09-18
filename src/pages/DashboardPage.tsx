import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import WatchlistGrid from '../components/WatchlistGrid';
import { useWatchlistQuery } from '../hooks/useWatchlist';
import { textLink, textMuted } from '../styles/ui';
import {
  getRecentlyAdded,
  getWatchlistStatistics,
} from '../utils/watchlistView';

function DashboardPage() {
  const { t } = useTranslation();
  const watchlist = useWatchlistQuery();
  const items = watchlist.data ?? [];
  const stats = getWatchlistStatistics(items);
  const recentlyAdded = getRecentlyAdded(items);

  return (
    <div className="p-page">
      <header className="mb-8">
        <h1 className="m-0 text-3xl font-bold text-foreground">
          {t('dashboard.title')}
        </h1>
        <p className="mt-1 text-muted">{t('dashboard.subtitle')}</p>
      </header>

      <section className="grid gap-4 mb-10 grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
        <div className="p-stat border border-border rounded-card bg-surface-raised shadow-card">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-muted">
            {t('dashboard.totalItems')}
          </p>
          <p className="m-0 mt-2 text-3xl font-bold text-foreground">
            {stats.totalItems}
          </p>
          <p className="m-0 mt-2 text-sm text-success">
            {t('dashboard.itemBreakdown', {
              movies: stats.movieCount,
              books: stats.bookCount,
            })}
          </p>
        </div>

        <div className="p-stat border border-border rounded-card bg-surface-raised shadow-card">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-muted">
            {t('dashboard.completed')}
          </p>
          <p className="m-0 mt-2 text-3xl font-bold text-foreground">
            {stats.doneCount}
          </p>
          <svg
            className="mt-3 block h-2 w-full"
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
            role="img"
            aria-label={t('dashboard.percentComplete', {
              rate: stats.completionRate,
            })}
          >
            <rect width="100" height="8" rx="4" className="fill-surface-overlay" />
            <rect
              width={stats.completionRate}
              height="8"
              rx="4"
              className="fill-accent"
            />
          </svg>
          <p className={`m-0 mt-2 text-sm ${textMuted}`}>
            {t('dashboard.percentDone', { rate: stats.completionRate })}
          </p>
        </div>

        <div className="p-stat border border-border rounded-card bg-surface-raised shadow-card">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-muted">
            {t('dashboard.inProgress')}
          </p>
          <p className="m-0 mt-2 text-3xl font-bold text-foreground">
            {stats.inProgressCount}
          </p>
          <p className={`m-0 mt-2 text-sm ${textMuted}`}>
            {t('dashboard.inProgressHint')}
          </p>
        </div>

        <div className="p-stat border border-border rounded-card bg-surface-raised shadow-card">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-muted">
            {t('dashboard.avgRating')}
          </p>
          <p className="m-0 mt-2 text-3xl font-bold text-foreground">
            {stats.averageRating ?? '—'}
          </p>
          <p className="m-0 mt-2 text-sm text-warning">
            {stats.averageRating !== null
              ? t('dashboard.basedOnRatings')
              : t('dashboard.noRatings')}
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="m-0 text-xl font-bold text-foreground">
            {t('dashboard.recentlyAdded')}
          </h2>
          <Link to="/watchlist" className={textLink}>
            {t('dashboard.viewAll')}
          </Link>
        </div>

        <WatchlistGrid
          items={recentlyAdded}
          empty={
            <div className="p-12 px-6 border border-dashed border-border rounded-card bg-surface-raised text-center">
              <p className={textMuted}>{t('dashboard.empty')}</p>
              <Link to="/add" className={`${textLink} inline-block mt-3`}>
                {t('dashboard.searchAndAdd')}
              </Link>
            </div>
          }
        >
          {(item) => (
            <WatchlistGrid.Card key={item.id} item={item}>
              <WatchlistGrid.Cover>
                <WatchlistGrid.Remove />
              </WatchlistGrid.Cover>
              <WatchlistGrid.Meta />
            </WatchlistGrid.Card>
          )}
        </WatchlistGrid>
      </section>
    </div>
  );
}

export default DashboardPage;
