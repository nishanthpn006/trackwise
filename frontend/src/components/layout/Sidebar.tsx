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
 * Provides a responsive, sticky, full-height left navigation bar:
 * - Desktop: 250px (expanded) or 72px (collapsed) with smooth transition
 * - Mobile: Slide-out drawer with dark backdrop blur overlay and outside-click close
 * - Independent scroll container for navigation items
 * - Keyboard accessible with escape key drawer dismissal
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
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* ── Desktop Sidebar ────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 bg-card border-r border-border/60 shadow-xs z-30 transition-all duration-200 select-none ${
          isCollapsed ? 'w-[72px]' : 'w-[250px]'
        }`}
        aria-label="Desktop Main Navigation"
      >
        {/* Header */}
        <SidebarHeader />

        {/* Navigation Items (Independent Scrolling) */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-muted">
          {NAVIGATION_ITEMS.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              onClick={item.isAction ? handleLogout : undefined}
            />
          ))}
        </nav>

        {/* Footer */}
        <SidebarFooter />
      </aside>

      {/* ── Mobile Slide-Out Drawer Overlay ────────────────────────────── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Slide-Out Drawer ────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-card border-r border-border shadow-xl flex flex-col md:hidden transition-transform duration-200 ease-in-out select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Navigation Drawer"
      >
        {/* Header */}
        <SidebarHeader isMobile />

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
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

        {/* Footer */}
        <SidebarFooter isMobile />
      </aside>
    </>
  );
};

export default Sidebar;
