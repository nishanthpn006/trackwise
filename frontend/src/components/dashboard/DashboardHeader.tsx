import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { User, LogOut, ChevronDown, Calendar, Sparkles } from 'lucide-react';

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
        .map((n) => n[0])
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-card via-card/95 to-muted/30 p-6 rounded-2xl border border-border/60 shadow-sm relative backdrop-blur-sm">
      {/* Welcome & Date Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, <span className="text-primary">{user?.fullName || 'User'}</span>
          </h1>
          <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
        </div>
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
          {formattedDate}
        </p>
      </div>

      {/* Profile Dropdown Section */}
      <div className="relative self-end sm:self-auto" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-muted/60 hover:bg-muted border border-border/50 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          aria-label="User profile menu"
        >
          <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-xs">
            {userInitials}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-foreground leading-tight">{user?.fullName || 'User'}</p>
            <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{user?.email}</p>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-popover text-popover-foreground rounded-xl border border-border shadow-lg py-1 z-50 animate-in fade-in-80 slide-in-from-top-2">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>

            <div className="py-1">
              <Link
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                Profile Settings
              </Link>
            </div>

            <div className="border-t border-border pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
              >
                <LogOut className="h-4 w-4 text-destructive" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
