import { useState } from 'react';
import WatchlistGrid from '../components/WatchlistGrid';
import { useWatchlist } from '../context/WatchlistContext';
import { calculateStatistics } from '../utils/statistics';

function ListPage() {
  const { items } = useWatchlist();
  const [type, setType] = useState(''); // '', 'movie', or 'book'
  const [status, setStatus] = useState(''); // '', 'want', 'watching', ...

  const stats = calculateStatistics(items);

  // Keep items that match the selected filters
  const filteredItems = items.filter((item) => {
    const typeOk = type === '' || item.type === type;
    const statusOk = status === '' || item.status === status;
    return typeOk && statusOk;
  });

  function chipClass(active: boolean) {
    return active ? 'chip active' : 'chip';
  }

  return (
    <div className="page">
      <div className="list-header">
        <div>
          <h1 className="page-title">Your Watchlist</h1>
          <p className="page-subtitle">
            Track what you want, what you&apos;re into, and what you&apos;ve finished.
          </p>
        </div>

        <div className="mini-stats">
          <div className="mini-stat">
            <p className="mini-stat-label">Total</p>
            <p className="mini-stat-value">{stats.totalItems}</p>
          </div>
          <div className="mini-stat">
            <p className="mini-stat-label">Watching</p>
            <p className="mini-stat-value">{stats.inProgressCount}</p>
          </div>
          <div className="mini-stat">
            <p className="mini-stat-label">Done</p>
            <p className="mini-stat-value">{stats.doneCount}</p>
          </div>
        </div>
      </div>

      <div className="chip-row">
        <button type="button" className={chipClass(type === '')} onClick={() => setType('')}>
          All
        </button>
        <button type="button" className={chipClass(type === 'movie')} onClick={() => setType('movie')}>
          Movies
        </button>
        <button type="button" className={chipClass(type === 'book')} onClick={() => setType('book')}>
          Books
        </button>
      </div>

      <div className="chip-row chip-row--last">
        <button type="button" className={chipClass(status === '')} onClick={() => setStatus('')}>
          All
        </button>
        <button type="button" className={chipClass(status === 'want')} onClick={() => setStatus('want')}>
          Want
        </button>
        <button
          type="button"
          className={chipClass(status === 'watching')}
          onClick={() => setStatus('watching')}
        >
          Watching
        </button>
        <button
          type="button"
          className={chipClass(status === 'reading')}
          onClick={() => setStatus('reading')}
        >
          Reading
        </button>
        <button type="button" className={chipClass(status === 'done')} onClick={() => setStatus('done')}>
          Done
        </button>
      </div>

      <WatchlistGrid items={filteredItems} />
    </div>
  );
}

export default ListPage;
