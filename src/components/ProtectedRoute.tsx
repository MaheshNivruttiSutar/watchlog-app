import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

/**
 * If the user is not logged in, send them to /login.
 * Otherwise show the page inside.
 */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
