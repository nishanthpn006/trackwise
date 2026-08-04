import React from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { LogOut, Settings } from 'lucide-react';

interface SidebarFooterProps {
  isMobile?: boolean;
}

/**
 * SidebarFooter — Displays authenticated user avatar, name, email, quick settings shortcut,
 * and sign-out button using AuthContext.
 */
export const SidebarFooter: React.FC<SidebarFooterProps> = ({ isMobile = false }) => {
  const { user, logout } = useAuth();
  const { isCollapsed, closeMobile } = useSidebar();
  const navigate = useNavigate();

  const collapsedView = !isMobile && isCollapsed;

  const handleLogout = () => {
    logout();
    if (isMobile) closeMobile();
    navigate('/login');
  };

  // Helper to extract initials from user full name (e.g., "John Doe" → "JD")
  const getInitials = (name?: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const userInitials = getInitials(user?.fullName);

  return (
    <div className="p-3 border-t border-border/60 shrink-0 bg-card/50">
      <div
        className={`flex items-center gap-3 p-2 rounded-xl border border-border/40 bg-muted/20 ${
          collapsedView ? 'justify-center p-1.5' : 'justify-between'
        }`}
      >
        {/* Avatar + User Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="h-8 w-8 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
            title={collapsedView && user ? `${user.fullName} (${user.email})` : undefined}
          >
            {userInitials}
          </div>

          {!collapsedView && user && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate leading-tight">
                {user.fullName}
              </span>
              <span className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                {user.email}
              </span>
            </div>
          )}
        </div>

        {/* Action Shortcuts (Settings & Logout) */}
        {!collapsedView && (
          <div className="flex items-center gap-1 shrink-0">
            <Link
              to="/profile"
              onClick={isMobile ? closeMobile : undefined}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Profile Settings"
              title="Profile Settings"
            >
              <Settings className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Sign Out"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarFooter;
