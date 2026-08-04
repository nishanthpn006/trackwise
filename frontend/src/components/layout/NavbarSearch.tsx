import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * NavbarSearch — Modern SaaS global search bar component with keyboard shortcut indicator (Ctrl+K / ⌘K),
 * global key binding, clear button, and compact mobile toggle mode.
 */
export const NavbarSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect OS for shortcut hint (⌘K for Mac, Ctrl+K for Windows/Linux)
  const [shortcutKey, setShortcutKey] = useState<string>('Ctrl K');

  useEffect(() => {
    if (typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)) {
      setShortcutKey('⌘ K');
    }
  }, []);

  // Global Ctrl+K / Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsMobileExpanded(true);
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && isMobileExpanded) {
        setIsMobileExpanded(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileExpanded]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex items-center">
      {/* ── Mobile Compact Search Toggle Button (< sm) ──────────────────── */}
      {!isMobileExpanded && (
        <button
          type="button"
          onClick={() => {
            setIsMobileExpanded(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="flex sm:hidden h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
          aria-label="Open search bar"
        >
          <Search className="h-4 w-4" />
        </button>
      )}

      {/* ── Search Bar Input Container ──────────────────────────────────── */}
      <div
        className={`${
          isMobileExpanded
            ? 'absolute right-0 top-1/2 -translate-y-1/2 z-50 w-[260px] sm:w-[280px] md:w-[320px]'
            : 'hidden sm:flex w-[200px] md:w-[280px] lg:w-[340px]'
        } relative items-center transition-all duration-200`}
      >
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none shrink-0" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transactions, categories..."
          aria-label="Search application"
          className="w-full h-9 pl-9 pr-14 text-xs bg-muted/40 dark:bg-muted/20 border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-background transition-all duration-200"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-muted-foreground hover:text-foreground rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Clear search query"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground/80 bg-background border border-border/60 rounded-md shadow-2xs select-none">
              {shortcutKey}
            </kbd>
          )}

          {isMobileExpanded && (
            <button
              type="button"
              onClick={() => setIsMobileExpanded(false)}
              className="p-1 sm:hidden text-muted-foreground hover:text-foreground rounded-md"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarSearch;
