import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { Menu } from 'lucide-react';

/**
 * Navbar — Top header bar with mobile hamburger trigger, branding, user info, and logout.
 */
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleMobile } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full bg-card border-b border-border/60 px-4 py-3 shadow-xs shrink-0">
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Trigger */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={toggleMobile}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link to="/" className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground text-xs font-extrabold flex items-center justify-center shadow-2xs">
              TW
            </span>
            <span>TrackWise</span>
          </Link>
        </div>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
