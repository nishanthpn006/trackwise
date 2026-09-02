import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, ChevronDown, Calendar, Settings } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const userInitials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      {/* Welcome & Date */}
      <div className="space-y-0.5 min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-foreground leading-tight">
          Welcome back,{' '}
          <span className="text-primary">{user?.fullName?.split(' ')[0] || 'there'}</span>
        </h1>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3 w-3 shrink-0" aria-hidden="true" />
          {formattedDate}
        </p>
      </div>

      {/* User profile dropdown */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2.5 py-1.5 pl-1.5 pr-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/60 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          aria-label="User profile menu"
        >
          <div className="h-7 w-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-bold text-[11px] shrink-0 border border-primary/20">
            {userInitials}
          </div>
          <span className="text-xs font-semibold text-foreground leading-none hidden sm:block max-w-[120px] truncate">
            {user?.fullName?.split(' ')[0] || 'Account'}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-popover border border-border/70 rounded-xl shadow-lg py-1 z-[var(--z-dropdown)] tw-animate-slide-down-fade overflow-hidden">
            <div className="px-3 py-2.5 border-b border-border/50">
              <p className="text-xs font-semibold text-foreground truncate">{user?.fullName}</p>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">{user?.email}</p>
            </div>

            <div className="py-1">
              <Link
                to="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors duration-100"
              >
                <Settings className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                Settings
              </Link>
            </div>

            <div className="border-t border-border/50 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors duration-100 text-left"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;

