import { createContext } from 'react';
import type { ThemeMode } from '@/types/settings';

export interface ThemeContextType {
  /** The user's selected preference (light | dark | system) */
  theme: ThemeMode;
  /** The actually rendered theme after resolving 'system' against prefers-color-scheme */
  resolvedTheme: 'light' | 'dark';
  /** Update the theme preference and apply it to the DOM immediately */
  setTheme: (theme: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
