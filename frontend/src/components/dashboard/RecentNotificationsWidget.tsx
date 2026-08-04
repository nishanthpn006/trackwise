import React from 'react';
import useNotifications from '@/hooks/useNotifications';
import NotificationCard from '@/components/notifications/NotificationCard';
import NotificationEmptyState from '@/components/notifications/NotificationEmptyState';
import { Bell, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router';

export const RecentNotificationsWidget: React.FC = () => {
  const { notifications, unreadCount, isLoading, isUpdating, markAsRead, deleteNotification, refetch } =
    useNotifications();

  const recent = notifications.slice(0, 4);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Recent Alerts & Reminders</h3>
            <p className="text-xs text-muted-foreground">Automated budget alerts and goal milestone progress</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <span className="px-2.5 py-1 text-xs font-extrabold bg-rose-500 text-white rounded-full">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="space-y-2.5">
        {isLoading ? (
          <div className="py-8 flex items-center justify-center text-xs text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Fetching alerts...</span>
          </div>
        ) : recent.length === 0 ? (
          <NotificationEmptyState onRefresh={refetch} />
        ) : (
          recent.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onMarkRead={markAsRead}
              onDelete={deleteNotification}
              isUpdating={isUpdating}
            />
          ))
        )}
      </div>

      <div className="pt-2 border-t border-border flex justify-end">
        <Link
          to="/settings"
          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <span>Manage Alert Preferences</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default RecentNotificationsWidget;
