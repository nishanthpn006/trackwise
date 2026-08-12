import React, { useState } from 'react';
import useNotifications from '@/hooks/useNotifications';
import UnreadBadge from './UnreadBadge';
import NotificationPanel from './NotificationPanel';
import { Bell } from 'lucide-react';

/**
 * NotificationBell — Trigger button for the notification center.
 *
 * The NotificationPanel is always mounted so CSS open/close transitions
 * play correctly. Visibility is controlled via `isOpen` prop.
 */
export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    isUpdating,
    filters,
    setFilters,
    refetch,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    generateSummaries,
  } = useNotifications();

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-2xs"
      >
        <Bell className="w-4 h-4" />
        <UnreadBadge count={unreadCount} />
      </button>

      {/* Panel is always mounted — visibility controlled by isOpen for smooth transitions */}
      <NotificationPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        isLoading={isLoading}
        isUpdating={isUpdating}
        filters={filters}
        onFilterChange={setFilters}
        onMarkRead={markAsRead}
        onMarkAllRead={markAllAsRead}
        onDelete={deleteNotification}
        onClearAll={clearAll}
        onGenerateSummary={generateSummaries}
        onRefresh={refetch}
      />
    </div>
  );
};

export default NotificationBell;
