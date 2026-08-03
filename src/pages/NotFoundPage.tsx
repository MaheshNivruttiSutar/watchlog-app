import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="page not-found-page">
      <div className="not-found-content">
        <p className="not-found-code" aria-hidden="true">
          404
        </p>
        <h1 className="page-title">Page not found</h1>
        <p className="page-subtitle">
        The page you are looking for does not exist.
        </p>
        <div className="not-found-actions">
          <Link className="btn btn-primary" to="/">
            Go to Dashboard
          </Link>
          <Link className="btn btn-secondary" to="/watchlist">
            Open Watchlist
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
