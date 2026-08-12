import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { useTheme } from '@/hooks/useTheme';
import { Menu, Sun, Moon } from 'lucide-react';
import NavbarSearch from './NavbarSearch';
import NavbarNotifications from './NavbarNotifications';
import NavbarProfile from './NavbarProfile';
import Logo from '@/components/common/Logo';
import { ChevronRight } from 'lucide-react';

/**
 * Navbar — Top navigation bar.
 *
 * Layout:
 * - LEFT:   Mobile hamburger + brand logo + route breadcrumb
 * - CENTER: Global search bar (Ctrl+K)
 * - RIGHT:  Notification bell + theme toggle (wired to ThemeContext) + user profile
 *
 * The theme toggle uses `useTheme()` — the same single source of truth as
 * Settings → Appearance. Clicking either control immediately updates the entire
 * application without a page reload.
 */
export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { toggleMobile } = useSidebar();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const location = useLocation();

  const isDark = resolvedTheme === 'dark';

  /**
   * Toggle between light and dark.
   * - If currently 'system', switch to the opposite of the resolved theme
   *   so the user gets an immediate, explicit override.
   */
  const handleThemeToggle = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      // system mode → switch to explicit opposite
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    }
  };

  // Derive breadcrumb page title from current route path
  const currentBreadcrumb = useMemo(() => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path === '/transactions') return 'Transactions';
    if (path === '/categories') return 'Categories';
    if (path === '/budgets') return 'Budgets';
    if (path === '/goals') return 'Goals';
    if (path === '/reports') return 'Reports';
    if (path === '/settings') return 'Settings';
    if (path === '/profile') return 'Profile';
    if (path === '/import-export') return 'Import / Export';
    return 'Overview';
  }, [location.pathname]);

  return (
    <header className="w-full h-16 bg-card border-b border-border/60 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-2xs shrink-0 select-none z-20 relative">
      {/* ── LEFT: Mobile Menu Trigger + Brand + Breadcrumbs ──────────────── */}
      <div className="flex items-center gap-4 sm:gap-5 shrink-0">
        {/* Mobile Hamburger Trigger */}
        {isAuthenticated && (
          <button
            type="button"
            onClick={toggleMobile}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Brand Logo (mobile or unauthenticated) */}
        <Link
          to="/"
          className="flex md:hidden items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-0.5"
          aria-label="TrackWise Home"
        >
          <Logo variant="navbar" className="group-hover:scale-105 transition-transform duration-200" />
        </Link>

        {/* Breadcrumb (desktop) */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="hover:text-foreground transition-colors duration-150">TrackWise</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
          <span className="text-foreground font-bold tracking-tight bg-primary/10 text-primary px-2.5 py-1 rounded-lg">
            {currentBreadcrumb}
          </span>
        </div>
      </div>

      {/* ── CENTER: Global Search Bar ───────────────────────────────────── */}
      {isAuthenticated && (
        <div className="flex-1 max-w-md mx-2 sm:mx-4 flex justify-center">
          <NavbarSearch />
        </div>
      )}

      {/* ── RIGHT: Notifications + Theme Toggle + Profile ───────── */}
      {isAuthenticated ? (
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notification Bell */}
          <NavbarNotifications />

          {/* Theme Toggle — wired to ThemeContext (single source of truth) */}
          <button
            type="button"
            onClick={handleThemeToggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-500 transition-transform duration-200" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 transition-transform duration-200" aria-hidden="true" />
            )}
          </button>

          {/* User Profile Dropdown */}
          <NavbarProfile />
        </div>
      ) : (
        /* Unauthenticated auth buttons */
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/login"
            className="text-xs font-semibold px-3 py-2 rounded-xl hover:bg-muted transition-colors duration-150 text-foreground"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all duration-150 active:scale-95"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
