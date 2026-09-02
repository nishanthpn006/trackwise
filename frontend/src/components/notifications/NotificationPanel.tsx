import React, { useRef, useEffect } from 'react';
import type { NotificationItem, NotificationFilters as FilterType } from '@/types/notification';
import NotificationCard from './NotificationCard';
import NotificationFilters from './NotificationFilters';
import NotificationEmptyState from './NotificationEmptyState';
import { CheckCheck, Trash2, Settings, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  isUpdating: boolean;
  filters: FilterType;
  onFilterChange: (newFilters: FilterType) => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onGenerateSummary: () => void;
  onRefresh: () => void;
}

/**
 * NotificationPanel — Dropdown notification center.
 *
 * Kept mounted at all times (controlled by isOpen) so both open and close
 * CSS transitions play correctly. Uses opacity + translateY for smooth entry/exit.
 * Correct z-index: sits above the Navbar (z-20) and backdrop (z-40).
 */
export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  isLoading,
  isUpdating,
  filters,
  onFilterChange,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onClearAll,
  onGenerateSummary,
  onRefresh,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Notification Center"
      aria-modal="false"
      className={`absolute right-0 top-12 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl z-[var(--z-drawer)] overflow-hidden flex flex-col max-h-[560px] transition-all duration-200 ease-out origin-top-right ${
        isOpen
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
      }`}
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-border/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white tabular-nums">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              disabled={isUpdating}
              title="Mark all as read"
              aria-label="Mark all notifications as read"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors duration-150 disabled:opacity-40"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              disabled={isUpdating}
              title="Clear all notifications"
              aria-label="Clear all notifications"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors duration-150 disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="px-3 py-2 border-b border-border/40 shrink-0">
        <NotificationFilters filters={filters} onFilterChange={onFilterChange} />
      </div>

      {/* Notification Cards Viewport */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[200px]">
        {isLoading ? (
          <div className="space-y-2.5 py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl tw-animate-shimmer border border-border/40" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <NotificationEmptyState onRefresh={onRefresh} />
        ) : (
          notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onMarkRead={onMarkRead}
              onDelete={onDelete}
              isUpdating={isUpdating}
            />
          ))
        )}
      </div>

      {/* Panel Footer */}
      <div className="p-3 border-t border-border/40 flex items-center justify-between text-xs shrink-0">
        <button
          type="button"
          onClick={onGenerateSummary}
          disabled={isUpdating}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors duration-150 disabled:opacity-40"
        >
          {isUpdating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>Generate Summary</span>
        </button>

        <Link
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Preferences</span>
        </Link>
      </div>
    </div>
  );
};

export default NotificationPanel;
