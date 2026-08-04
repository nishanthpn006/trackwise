import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { User as UserIcon, Settings, HelpCircle, LogOut, ChevronDown } from 'lucide-react';

/**
 * NavbarProfile — User profile dropdown menu component utilizing AuthContext for real user identity,
 * displaying avatar initials, full name, email, quick settings links, and sign-out logic.
 */
export const NavbarProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Outside-click & Escape key dismissal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  // Generate initials from user full name
  const getInitials = (name?: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(user?.fullName);

  if (!user) return null;

  return (
    <div className="relative" ref={containerRef}>
      {/* Profile Avatar Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="User account menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2.5 p-1 rounded-full sm:rounded-xl border border-border/40 hover:border-border/80 hover:bg-muted/50 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* Avatar Circle */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
          {initials}
        </div>

        {/* Desktop Name & Email snippet */}
        <div className="hidden lg:flex flex-col text-left pr-1">
          <span className="text-xs font-semibold text-foreground truncate max-w-[120px] leading-tight">
            {user.fullName}
          </span>
          <span className="text-[10px] text-muted-foreground truncate max-w-[120px] leading-tight mt-0.5">
            {user.email}
          </span>
        </div>

        <ChevronDown
          className={`hidden sm:block h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-foreground' : ''
          }`}
        />
      </button>

      {/* Profile Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[240px] bg-card border border-border/70 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Info Header */}
          <div className="p-3.5 border-b border-border/60 bg-muted/20 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-extrabold text-sm flex items-center justify-center shrink-0 border border-primary/20">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{user.fullName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          {/* Menu Actions */}
          <div className="p-1.5 space-y-0.5">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <UserIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Settings className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Settings</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-left"
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Help & Support</span>
            </button>
          </div>

          <div className="h-px bg-border/60 my-0.5" />

          {/* Logout Button */}
          <div className="p-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-left"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarProfile;
