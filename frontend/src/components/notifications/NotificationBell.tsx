import React, { useState } from 'react';
import useNotifications from '@/hooks/useNotifications';
import UnreadBadge from './UnreadBadge';
import NotificationPanel from './NotificationPanel';
import { Bell } from 'lucide-react';

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
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notification Center, ${unreadCount} unread notifications`}
        className="relative p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs"
      >
        <Bell className="w-5 h-5" />
        <UnreadBadge count={unreadCount} />
      </button>

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
