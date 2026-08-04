import { createContext } from 'react';

export interface SidebarContextType {
  /** Desktop sidebar collapsed state (true = 72px, false = 250px) */
  isCollapsed: boolean;

  /** Toggle desktop sidebar between collapsed and expanded */
  toggleCollapse: () => void;

  /** Mobile drawer open state */
  isMobileOpen: boolean;

  /** Toggle mobile drawer open/close */
  toggleMobile: () => void;

  /** Explicitly close mobile drawer (e.g. on navigation link click) */
  closeMobile: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
