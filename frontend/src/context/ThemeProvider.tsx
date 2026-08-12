import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeMode } from '@/types/settings';

const STORAGE_KEY = 'trackwise_theme';

/** Return current OS-level dark preference */
function getSystemResolvedTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Apply theme to the document root and return the resolved value */
function applyThemeToDOM(theme: ThemeMode): 'light' | 'dark' {
  const root = document.documentElement;
  const resolved: 'light' | 'dark' = theme === 'system' ? getSystemResolvedTheme() : theme;
  root.classList.toggle('dark', resolved === 'dark');
  return resolved;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider — Single source of truth for application theme.
 *
 * - Reads initial preference from localStorage on mount.
 * - Applies the class to <html> immediately (no flash).
 * - Listens to OS prefers-color-scheme changes when mode is 'system'.
 * - Exposes `theme`, `resolvedTheme`, and `setTheme` to all consumers.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system';
    } catch {
      return 'system';
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const stored = (() => {
      try {
        return (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system';
      } catch {
        return 'system' as ThemeMode;
      }
    })();
    return applyThemeToDOM(stored);
  });

  // Re-apply whenever system preference changes and mode is 'system'
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const resolved = applyThemeToDOM('system');
      setResolvedTheme(resolved);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Ignore storage errors in restricted environments
    }
    const resolved = applyThemeToDOM(newTheme);
    setThemeState(newTheme);
    setResolvedTheme(resolved);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
