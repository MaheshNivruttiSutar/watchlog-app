import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { btnPrimary, btnSecondary } from '../styles/ui';

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen p-page text-center bg-[radial-gradient(ellipse_60%_40%_at_50%_35%,var(--color-accent-soft),transparent_70%),var(--color-surface)]">
      <div className="max-w-md p-4 animate-not-found-enter">
        <p
          className="m-0 mb-2 text-[clamp(4.5rem,14vw,7rem)] font-bold leading-none tracking-tighter text-accent opacity-85"
          aria-hidden="true"
        >
          404
        </p>
        <h1 className="m-0 text-3xl font-bold text-foreground">
          {t('notFound.title')}
        </h1>
        <p className="mt-3 leading-normal text-muted">
          {t('notFound.description')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
          <Link className={btnPrimary} to="/">
            {t('notFound.dashboard')}
          </Link>
          <Link className={btnSecondary} to="/watchlist">
            {t('notFound.watchlist')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
