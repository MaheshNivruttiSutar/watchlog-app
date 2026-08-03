import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { WatchlistProvider } from './context/WatchlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import AddEditPage from './pages/AddEditPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/watchlist" element={<ListPage />} />
          <Route path="/items/:id" element={<DetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddEditPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WatchlistProvider>
          <AppLayout />
        </WatchlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;