import { Outlet } from 'react-router';

/**
 * ProtectedRoute — authentication guard placeholder.
 *
 * Currently passes through all requests unconditionally.
 * In Milestone 3, this will redirect to /login when the user is unauthenticated.
 */
const ProtectedRoute = () => <Outlet />;

export default ProtectedRoute;
