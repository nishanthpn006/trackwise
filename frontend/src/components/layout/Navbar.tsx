import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { Menu, Sun, Moon, ChevronRight } from 'lucide-react';
import NavbarSearch from './NavbarSearch';
import NavbarNotifications from './NavbarNotifications';
import NavbarProfile from './NavbarProfile';
import Logo from '@/components/common/Logo';

/**
 * Navbar — Professional SaaS top navigation bar.
 *
 * Layout Structure:
 * - LEFT: Mobile hamburger trigger + TrackWise brand logo + Route Breadcrumbs
 * - CENTER: Global search bar with Ctrl+K shortcut hint
 * - RIGHT: Notification bell popover + Theme toggle placeholder + User profile dropdown
 */
export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { toggleMobile } = useSidebar();
  const location = useLocation();

  // Theme toggle UI state placeholder (light / dark icon toggle)
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  // Derive breadcrumb page title from current route path
  const currentBreadcrumb = useMemo(() => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path === '/transactions') return 'Transactions';
    if (path === '/categories') return 'Categories';
    if (path === '/budgets') return 'Budgets';
    if (path === '/goals') return 'Goals';
    if (path === '/profile') return 'Profile';
    return 'Overview';
  }, [location.pathname]);

  return (
    <header className="w-full h-16 bg-card border-b border-border/60 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-2xs shrink-0 select-none z-20">
      {/* ── LEFT: Mobile Menu Trigger + Brand + Breadcrumbs ──────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Mobile Hamburger Trigger */}
        {isAuthenticated && (
          <button
            type="button"
            onClick={toggleMobile}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Brand Logo (Visible on mobile or when unauthenticated) */}
        <Link
          to="/"
          className="flex md:hidden items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-0.5"
          aria-label="TrackWise Home"
        >
          <Logo variant="navbar" className="group-hover:scale-105 transition-transform duration-200" />
        </Link>

        {/* Breadcrumb Navigation (Desktop) */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="hover:text-foreground transition-colors">TrackWise</span>
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

      {/* ── RIGHT: Notifications + Theme Toggle + Profile Dropdown ───────── */}
      {isAuthenticated ? (
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notification Bell */}
          <NavbarNotifications />

          {/* Theme Toggle Placeholder */}
          <button
            type="button"
            onClick={() => setIsDarkTheme((prev) => !prev)}
            aria-label={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            title={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkTheme ? (
              <Sun className="h-4 w-4 text-amber-500 transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 transition-transform duration-200 hover:-rotate-12" />
            )}
          </button>

          {/* User Profile Dropdown */}
          <NavbarProfile />
        </div>
      ) : (
        /* Unauthenticated Auth Buttons Fallback */
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/login"
            className="text-xs font-semibold px-3 py-2 rounded-xl hover:bg-muted transition-colors text-foreground"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-colors"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
