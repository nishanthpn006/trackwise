import { Outlet } from 'react-router';

/**
 * AuthLayout — wraps public authentication pages (Login, Register).
 * Centered card layout will be applied in Milestone 3.
 */
const AuthLayout = () => (
  <div>
    <Outlet />
  </div>
);

export default AuthLayout;
