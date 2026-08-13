import { NavLink, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const sidebarLinkClass =
  'block py-2 px-3 rounded-button text-sm font-medium text-muted transition-colors duration-150 hover:bg-surface-overlay hover:text-foreground';

const sidebarLinkActiveClass = 'bg-accent-soft text-accent';

const sidebarActionClass =
  'py-2 px-3 border-0 rounded-button bg-transparent text-sm text-muted text-left cursor-pointer transition-colors duration-150 hover:bg-surface-overlay hover:text-foreground';

function Sidebar() {
  const { currentUser, logout } = useAuth();

  return (
    <aside className="sticky top-0 flex flex-col w-64 h-screen shrink-0 border-r border-border bg-surface-raised">
      <div className="p-5 border-b border-border">
        <Link to="/" className="text-xl font-bold text-foreground">
          WatchLog
        </Link>
        <p className="mt-0.5 text-xs text-muted">Premium Tracking</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? `${sidebarLinkClass} ${sidebarLinkActiveClass}` : sidebarLinkClass
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/add"
          className={({ isActive }) =>
            isActive ? `${sidebarLinkClass} ${sidebarLinkActiveClass}` : sidebarLinkClass
          }
        >
          Search
        </NavLink>
        <NavLink
          to="/watchlist"
          className={({ isActive }) =>
            isActive ? `${sidebarLinkClass} ${sidebarLinkActiveClass}` : sidebarLinkClass
          }
        >
          Watchlist
        </NavLink>
      </nav>

      <div className="flex flex-col gap-2 p-3 border-t border-border">
        <div className="flex items-center justify-between min-h-10 py-2 px-3">
          <span className="text-sm leading-none text-muted">Theme</span>
          <ThemeToggle />
        </div>

        {currentUser ? (
          <button type="button" onClick={logout} className={sidebarActionClass}>
            Log out
          </button>
        ) : (
          <Link to="/login" className={sidebarActionClass}>
            Log in
          </Link>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
