import { NavLink, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { currentUser, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Link to="/" className="sidebar-logo">
          WatchLog
        </Link>
        <p className="sidebar-tagline">Premium Tracking</p>
      </div>

      <nav className="sidebar-nav" aria-label="Main">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/add"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Search
        </NavLink>
        <NavLink
          to="/watchlist"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Watchlist
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-theme-row">
          <span className="sidebar-theme-label">Theme</span>
          <ThemeToggle />
        </div>

        {currentUser ? (
          <button type="button" onClick={logout} className="sidebar-action">
            Log out
          </button>
        ) : (
          <Link to="/login" className="sidebar-action">
            Log in
          </Link>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
