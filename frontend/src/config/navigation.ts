import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Receipt,
  Landmark,
  Tags,
  Wallet,
  Target,
  Sparkles,
  CalendarClock,
  Repeat,
  BarChart3,
  Database,
  Settings,
  User,
  LogOut,
} from 'lucide-react';

export interface NavItemConfig {
  /** Display label for the navigation link */
  label: string;

  /** Target route path (or empty string for actions like logout) */
  path: string;

  /** Lucide icon component */
  icon: LucideIcon;

  /** Optional badge text or count (e.g. "New") */
  badge?: string;

  /** Whether this item is an action button (e.g. Logout) rather than a page link */
  isAction?: boolean;

  /** Accessible label description */
  ariaLabel: string;
}

export const NAVIGATION_ITEMS: NavItemConfig[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    ariaLabel: 'Navigate to Dashboard overview',
  },
  {
    label: 'Accounts',
    path: '/accounts',
    icon: Landmark,
    ariaLabel: 'Navigate to Financial Accounts & Ledgers',
  },
  {
    label: 'Transactions',
    path: '/transactions',
    icon: Receipt,
    ariaLabel: 'Navigate to Transactions list',
  },
  {
    label: 'Subscriptions',
    path: '/subscriptions',
    icon: Sparkles,
    ariaLabel: 'Navigate to Subscription Tracking',
  },
  {
    label: 'Bills',
    path: '/bills',
    icon: CalendarClock,
    ariaLabel: 'Navigate to Bill Reminders',
  },
  {
    label: 'Recurring',
    path: '/recurring',
    icon: Repeat,
    ariaLabel: 'Navigate to Recurring Automation Rules',
  },
  {
    label: 'Categories',
    path: '/categories',
    icon: Tags,
    ariaLabel: 'Navigate to Category management',
  },
  {
    label: 'Budgets',
    path: '/budgets',
    icon: Wallet,
    ariaLabel: 'Navigate to Budgets overview',
  },
  {
    label: 'Goals',
    path: '/goals',
    icon: Target,
    ariaLabel: 'Navigate to Financial Goals',
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: BarChart3,
    ariaLabel: 'Navigate to Reports & Financial Analytics',
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    ariaLabel: 'Navigate to Settings & User Preferences',
  },
  {
    label: 'Import / Export',
    path: '/import-export',
    icon: Database,
    ariaLabel: 'Navigate to Import, Export & Data Backup',
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: User,
    ariaLabel: 'Navigate to User Profile and Settings',
  },
  {
    label: 'Logout',
    path: '',
    icon: LogOut,
    isAction: true,
    ariaLabel: 'Sign out of TrackWise account',
  },
];

export default NAVIGATION_ITEMS;
