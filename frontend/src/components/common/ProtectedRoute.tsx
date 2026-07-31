import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import GlobalLoadingPage from '@/pages/GlobalLoadingPage';

/**
 * ProtectedRoute — Route guard enforcing authentication.
 * Redirects unauthenticated users to /login and preserves original location.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <GlobalLoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
