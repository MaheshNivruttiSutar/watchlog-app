import { Link, useNavigate } from 'react-router-dom';
import WatchlistCard from '../components/WatchlistCard';
import { useWatchlist } from '../context/WatchlistContext';
import { calculateStatistics } from '../utils/statistics';
import { textLink, textMuted } from '../styles/ui';

function DashboardPage() {
  const { items, removeItem } = useWatchlist();
  const navigate = useNavigate();
  const stats = calculateStatistics(items);

  const recentlyAdded = [...items]
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
    .slice(0, 5);

  return (
    <div className="p-page">
      <header className="mb-8">
        <h1 className="m-0 text-3xl font-bold text-foreground">System Overview</h1>
        <p className="mt-1 text-muted">A snapshot of your WatchLog activity.</p>
      </header>

      <section className="grid gap-4 mb-10 grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
        <div className="p-stat border border-border rounded-card bg-surface-raised shadow-card">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-muted">
            Total items
          </p>
          <p className="m-0 mt-2 text-3xl font-bold text-foreground">
            {stats.totalItems}
          </p>
          <p className="m-0 mt-2 text-sm text-success">
            {stats.movieCount} movies · {stats.bookCount} books
          </p>
        </div>

        <div className="p-stat border border-border rounded-card bg-surface-raised shadow-card">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-muted">
            Completed
          </p>
          <p className="m-0 mt-2 text-3xl font-bold text-foreground">
            {stats.doneCount}
          </p>
          <svg
            className="mt-3 block h-2 w-full"
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
            role="img"
            aria-label={`${stats.completionRate} percent complete`}
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
            {stats.completionRate}% done
          </p>
        </div>

        <div className="p-stat border border-border rounded-card bg-surface-raised shadow-card">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-muted">
            In progress
          </p>
          <p className="m-0 mt-2 text-3xl font-bold text-foreground">
            {stats.inProgressCount}
          </p>
          <p className={`m-0 mt-2 text-sm ${textMuted}`}>Watching or reading now</p>
        </div>

        <div className="p-stat border border-border rounded-card bg-surface-raised shadow-card">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-muted">
            Avg rating
          </p>
          <p className="m-0 mt-2 text-3xl font-bold text-foreground">
            {stats.averageRating ?? '—'}
          </p>
          <p className="m-0 mt-2 text-sm text-warning">
            {stats.averageRating !== null ? 'Based on your ratings' : 'No ratings yet'}
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="m-0 text-xl font-bold text-foreground">Recently added</h2>
          <Link to="/watchlist" className={textLink}>
            View all
          </Link>
        </div>

        {recentlyAdded.length === 0 ? (
          <div className="p-12 px-6 border border-dashed border-border rounded-card bg-surface-raised text-center">
            <p className={textMuted}>Nothing on your list yet.</p>
            <Link to="/add" className={`${textLink} inline-block mt-3`}>
              Search and add media
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-card-gap">
            {recentlyAdded.map((item) => (
              <WatchlistCard
                key={item.id}
                item={item}
                onSelect={(id) => navigate(`/items/${encodeURIComponent(id)}`)}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
