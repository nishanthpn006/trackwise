import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { NAVIGATION_ITEMS } from '@/config/navigation';
import SidebarHeader from './SidebarHeader';
import SidebarItem from './SidebarItem';
import SidebarFooter from './SidebarFooter';

/**
 * Sidebar — Main application sidebar component.
 *
 * Desktop: 250px expanded / 72px collapsed, sticky, with smooth width transition.
 * Mobile:  Slide-out drawer with semi-transparent backdrop and blur.
 *
 * Layering:
 *   Page < Backdrop (z-40) < Sidebar drawer (z-50) < Sidebar controls
 *
 * The backdrop is always rendered on mobile when the drawer state changes,
 * using opacity/pointer-events transitions so the close animation plays
 * correctly (rather than an abrupt conditional unmount).
 */
export const Sidebar: React.FC = () => {
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate('/login');
  };

  // Close mobile sidebar on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        closeMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, closeMobile]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 sidebar-surface border-r z-[var(--z-sidebar)] select-none transition-[width] duration-200 ease-in-out ${
          isCollapsed ? 'w-[72px]' : 'w-[250px]'
        }`}
        aria-label="Desktop Main Navigation"
      >
        <SidebarHeader />

        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-0.5 scrollbar-thin scrollbar-thumb-muted"
          aria-label="Main navigation"
        >
          {NAVIGATION_ITEMS.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              onClick={item.isAction ? handleLogout : undefined}
            />
          ))}
        </nav>

        <SidebarFooter />
      </aside>

      {/* ── Mobile Backdrop ──────────────────────────────────────────────── */}
      {/*
        Keep in DOM at all times (on mobile) so transitions work on close.
        pointer-events:none when closed so it doesn't block interactions.
      */}
      <div
        className={`fixed inset-0 z-[var(--z-backdrop)] md:hidden transition-opacity duration-300 ease-in-out ${
          isMobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* ── Mobile Slide-Out Drawer ──────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-[var(--z-drawer)] w-[280px] sidebar-surface border-r shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-in-out select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Navigation Drawer"
        aria-hidden={!isMobileOpen}
      >
        <SidebarHeader isMobile />

        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-0.5"
          aria-label="Mobile main navigation"
        >
          {NAVIGATION_ITEMS.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              isMobile
              onClick={() => {
                if (item.isAction) {
                  handleLogout();
                } else {
                  closeMobile();
                }
              }}
            />
          ))}
        </nav>

        <SidebarFooter isMobile />
      </aside>
    </>
  );
};

export default Sidebar;
