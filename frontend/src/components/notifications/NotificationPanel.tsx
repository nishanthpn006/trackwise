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

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-12 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[540px] animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-extrabold text-foreground">Notification Center</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
              {unreadCount} unread
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
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4 text-emerald-500" />
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              disabled={isUpdating}
              title="Clear all notifications"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 border-b border-border bg-card">
        <NotificationFilters filters={filters} onFilterChange={onFilterChange} />
      </div>

      {/* Notification Cards Viewport */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[220px]">
        {isLoading ? (
          <div className="space-y-2.5 py-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-muted/40 animate-pulse border border-border" />
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
      <div className="p-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={onGenerateSummary}
          disabled={isUpdating}
          className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline disabled:opacity-50"
        >
          {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>Generate Summary Digest</span>
        </button>

        <Link
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Preferences</span>
        </Link>
      </div>
    </div>
  );
};

export default NotificationPanel;
