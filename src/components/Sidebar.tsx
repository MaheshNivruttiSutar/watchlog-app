import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

const sidebarLinkClass =
  'block py-2 px-3 rounded-button text-sm font-medium text-muted transition-colors duration-150 hover:bg-surface-overlay hover:text-foreground';

const sidebarLinkActiveClass = 'bg-accent-soft text-accent';

const sidebarActionClass =
  'py-2 px-3 border-0 rounded-button bg-transparent text-sm text-muted text-left cursor-pointer transition-colors duration-150 hover:bg-surface-overlay hover:text-foreground';

function Sidebar() {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();

  return (
    <aside className="sticky top-0 flex flex-col w-64 h-screen shrink-0 border-r border-border bg-surface-raised">
      <div className="p-5 border-b border-border">
        <Link to="/" className="text-xl font-bold text-foreground">
          {t('app.name')}
        </Link>
        <p className="mt-0.5 text-xs text-muted">{t('app.tagline')}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label={t('nav.main')}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? `${sidebarLinkClass} ${sidebarLinkActiveClass}` : sidebarLinkClass
          }
        >
          {t('nav.dashboard')}
        </NavLink>
        <NavLink
          to="/add"
          className={({ isActive }) =>
            isActive ? `${sidebarLinkClass} ${sidebarLinkActiveClass}` : sidebarLinkClass
          }
        >
          {t('nav.search')}
        </NavLink>
        <NavLink
          to="/watchlist"
          className={({ isActive }) =>
            isActive ? `${sidebarLinkClass} ${sidebarLinkActiveClass}` : sidebarLinkClass
          }
        >
          {t('nav.watchlist')}
        </NavLink>
      </nav>

      <div className="flex flex-col gap-2 p-3 border-t border-border">
        <div className="flex items-center justify-between min-h-10 py-2 px-3">
          <span className="text-sm leading-none text-muted">{t('theme.label')}</span>
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-between min-h-10 py-2 px-3 gap-2">
          <span className="text-sm leading-none text-muted">{t('language.label')}</span>
          <LanguageToggle />
        </div>

        {currentUser ? (
          <button type="button" onClick={logout} className={sidebarActionClass}>
            {t('auth.logOut')}
          </button>
        ) : (
          <Link to="/login" className={sidebarActionClass}>
            {t('auth.logIn')}
          </Link>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
