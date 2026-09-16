import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import AddEditPage from './pages/AddEditPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import { queryClient } from './query/queryClient';

function AppLayout() {
  return (
    <div className="flex items-start min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 min-w-0">
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
      {import.meta.env.DEV ? (
        <ReactQueryDevtools initialIsOpen buttonPosition="bottom-left" />
      ) : null}
    </QueryClientProvider>
  );
}

export default App;
