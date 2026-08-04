import React from 'react';
import { NavLink, useLocation } from 'react-router';
import type { NavItemConfig } from '@/config/navigation';
import { useSidebar } from '@/hooks/useSidebar';

interface SidebarItemProps {
  item: NavItemConfig;
  /** Optional click callback (e.g. for closeMobile or logout) */
  onClick?: () => void;
  /** If true, rendered inside mobile drawer (always shows text label) */
  isMobile?: boolean;
}

/**
 * SidebarItem — Navigation link/button component supporting active route detection,
 * left accent border, active primary colors, hover animations, focus-visible accessibility,
 * and collapsed icon-only mode.
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({ item, onClick, isMobile = false }) => {
  const { isCollapsed } = useSidebar();
  const location = useLocation();

  const collapsedView = !isMobile && isCollapsed;
  const Icon = item.icon;

  // Determine if this item matches the current active location
  const isActive = item.path ? location.pathname === item.path : false;

  const baseClasses =
    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  const activeClasses =
    'bg-primary/10 text-primary font-semibold shadow-2xs before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-r-md before:bg-primary';

  const inactiveClasses =
    'text-muted-foreground hover:text-foreground hover:bg-muted/60';

  const combinedClasses = `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${
    collapsedView ? 'justify-center px-0' : ''
  }`;

  const content = (
    <>
      <Icon
        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
          isActive ? 'text-primary scale-110' : 'text-muted-foreground group-hover:text-foreground group-hover:scale-105'
        }`}
      />
      {!collapsedView && (
        <span className="truncate flex-1 text-left">{item.label}</span>
      )}
      {!collapsedView && item.badge && (
        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-primary text-primary-foreground shrink-0">
          {item.badge}
        </span>
      )}
    </>
  );

  // If this item is an action (e.g., Logout), render a button
  if (item.isAction) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${combinedClasses} w-full group text-destructive hover:bg-destructive/10 hover:text-destructive`}
        aria-label={item.ariaLabel}
        title={collapsedView ? item.label : undefined}
      >
        <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 text-destructive group-hover:scale-110" />
        {!collapsedView && <span className="truncate flex-1 text-left">{item.label}</span>}
      </button>
    );
  }

  // Otherwise render a standard NavLink
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={combinedClasses}
      aria-label={item.ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      title={collapsedView ? item.label : undefined}
    >
      {content}
    </NavLink>
  );
};

export default SidebarItem;
