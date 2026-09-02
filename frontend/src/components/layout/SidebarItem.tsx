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
 * SidebarItem — Navigation link/button.
 *
 * Supports:
 * - Active route detection with left accent border
 * - Hover state with background + foreground color change
 * - Active/pressed scale feedback
 * - Icon scale on active
 * - Collapsed icon-only mode (desktop)
 * - Keyboard focus-visible ring
 * - Tooltip in collapsed mode
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({ item, onClick, isMobile = false }) => {
  const { isCollapsed } = useSidebar();
  const location = useLocation();

  const collapsedView = !isMobile && isCollapsed;
  const Icon = item.icon;

  const isActive = item.path ? location.pathname === item.path : false;

  const baseClasses =
    'group relative flex items-center gap-3 rounded-xl text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none active:scale-[0.97]';

  const paddingClasses = collapsedView ? 'justify-center p-2.5' : 'px-3 py-2.5';

  const activeClasses =
    'bg-primary/10 text-primary before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-r-full before:bg-primary';

  const inactiveClasses =
    'text-muted-foreground hover:text-foreground hover:bg-muted/60';

  const combinedClasses = `${baseClasses} ${paddingClasses} ${isActive ? activeClasses : inactiveClasses}`;

  const content = (
    <>
      <Icon
        className={`h-4 w-4 shrink-0 transition-all duration-150 ${
          isActive
            ? 'text-primary scale-110'
            : 'text-muted-foreground group-hover:text-foreground'
        }`}
        aria-hidden="true"
      />
      {!collapsedView && (
        <span className="truncate flex-1 text-left leading-none">{item.label}</span>
      )}
      {!collapsedView && item.badge && (
        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-primary text-primary-foreground shrink-0 leading-none">
          {item.badge}
        </span>
      )}

      {/* Floating tooltip for collapsed icon-only desktop mode */}
      {collapsedView && (
        <span
          role="tooltip"
          className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-popover text-popover-foreground text-xs font-medium shadow-lg border border-border opacity-0 scale-95 pointer-events-none transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 whitespace-nowrap z-[var(--z-drawer)]"
        >
          {item.label}
          {item.badge && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold">
              {item.badge}
            </span>
          )}
        </span>
      )}
    </>
  );

  // Action item (e.g. Logout) — renders as button
  if (item.isAction) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} ${paddingClasses} w-full text-destructive/70 hover:text-destructive hover:bg-destructive/10`}
        aria-label={item.ariaLabel}
      >
        <Icon
          className="h-4 w-4 shrink-0 transition-colors duration-150 text-destructive/70 group-hover:text-destructive"
          aria-hidden="true"
        />
        {!collapsedView && (
          <span className="truncate flex-1 text-left leading-none">{item.label}</span>
        )}
        {collapsedView && (
          <span
            role="tooltip"
            className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-popover text-destructive text-xs font-medium shadow-lg border border-border opacity-0 scale-95 pointer-events-none transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 whitespace-nowrap z-[var(--z-drawer)]"
          >
            {item.label}
          </span>
        )}
      </button>
    );
  }

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={combinedClasses}
      aria-label={item.ariaLabel}
      aria-current={isActive ? 'page' : undefined}
    >
      {content}
    </NavLink>
  );
};

export default SidebarItem;
