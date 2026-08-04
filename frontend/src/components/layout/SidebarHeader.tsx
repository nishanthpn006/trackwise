import React from 'react';
import { Link } from 'react-router';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Logo from '@/components/common/Logo';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  /** If true, rendered inside the mobile drawer */
  isMobile?: boolean;
}

/**
 * SidebarHeader — Branding header displaying TrackWise logo, title, and subtitle,
 * along with desktop collapse toggle and mobile close buttons.
 */
export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isMobile = false }) => {
  const { isCollapsed, toggleCollapse, closeMobile } = useSidebar();

  const collapsedView = !isMobile && isCollapsed;

  return (
    <div className={cn(
      "flex items-center h-16 px-4 border-b border-border/60 shrink-0",
      collapsedView ? "justify-center px-2" : "justify-between"
    )}>
      <Link
        to="/"
        className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1 transition-colors"
        aria-label="TrackWise Home"
      >
        <Logo
          variant={collapsedView ? 'icon-only' : 'sidebar'}
          size={32}
          className="group-hover:scale-105 transition-transform duration-200"
        />
      </Link>

      {/* Desktop Collapse / Expand Toggle Button */}
      {!isMobile && (
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      )}

      {/* Mobile Drawer Close Button */}
      {isMobile && (
        <button
          type="button"
          onClick={closeMobile}
          className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
          aria-label="Close mobile sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SidebarHeader;
