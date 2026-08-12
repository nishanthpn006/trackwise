import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

/**
 * useTheme — Access the centralized theme context.
 *
 * Returns `theme` (preference), `resolvedTheme` (actual rendered theme),
 * and `setTheme` (update + apply).
 *
 * Must be used within a <ThemeProvider>.
 */
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};

export default useTheme;
