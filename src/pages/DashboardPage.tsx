import { Link, useNavigate } from 'react-router-dom';
import WatchlistCard from '../components/WatchlistCard';
import { useWatchlist } from '../context/WatchlistContext';
import { calculateStatistics } from '../utils/statistics';

function DashboardPage() {
  const { items, removeItem } = useWatchlist();
  const navigate = useNavigate();
  const stats = calculateStatistics(items);

  // Newest items first, take only 4
  const recentlyAdded = [...items]
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
    .slice(0, 5);

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">System Overview</h1>
        <p className="page-subtitle">A snapshot of your WatchLog activity.</p>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <p className="stat-card-label">Total items</p>
          <p className="stat-card-value">{stats.totalItems}</p>
          <p className="stat-card-note text-success">
            {stats.movieCount} movies · {stats.bookCount} books
          </p>
        </div>

        <div className="stat-card">
          <p className="stat-card-label">Completed</p>
          <p className="stat-card-value">{stats.doneCount}</p>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <p className="stat-card-note text-muted">{stats.completionRate}% done</p>
        </div>

        <div className="stat-card">
          <p className="stat-card-label">In progress</p>
          <p className="stat-card-value">{stats.inProgressCount}</p>
          <p className="stat-card-note text-muted">Watching or reading now</p>
        </div>

        <div className="stat-card">
          <p className="stat-card-label">Avg rating</p>
          <p className="stat-card-value">{stats.averageRating ?? '—'}</p>
          <p className="stat-card-note text-warning">
            {stats.averageRating !== null ? 'Based on your ratings' : 'No ratings yet'}
          </p>
        </div>
      </section>

      <section>
        <div className="section-header">
          <h2 className="section-title">Recently added</h2>
          <Link to="/watchlist" className="text-link">
            View all
          </Link>
        </div>

        {recentlyAdded.length === 0 ? (
          <div className="empty-state">
            <p className="text-muted">Nothing on your list yet.</p>
            <Link to="/add" className="text-link">
              Search and add media
            </Link>
          </div>
        ) : (
          <div className="card-grid">
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
