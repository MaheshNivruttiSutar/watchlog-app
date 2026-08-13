import { Link } from 'react-router-dom';
import { btnPrimary, btnSecondary } from '../styles/ui';

function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-page text-center bg-[radial-gradient(ellipse_60%_40%_at_50%_35%,var(--color-accent-soft),transparent_70%),var(--color-surface)]">
      <div className="max-w-md p-4 animate-not-found-enter">
        <p
          className="m-0 mb-2 text-[clamp(4.5rem,14vw,7rem)] font-bold leading-none tracking-tighter text-accent opacity-85"
          aria-hidden="true"
        >
          404
        </p>
        <h1 className="m-0 text-3xl font-bold text-foreground">Page not found</h1>
        <p className="mt-3 leading-normal text-muted">
          The page you are looking for does not exist.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
          <Link className={btnPrimary} to="/">
            Go to Dashboard
          </Link>
          <Link className={btnSecondary} to="/watchlist">
            Open Watchlist
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
