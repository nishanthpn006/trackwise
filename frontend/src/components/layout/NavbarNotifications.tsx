import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, AlertTriangle, Sparkles } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Monthly Summary Ready',
    message: 'Your July spending analysis has been computed.',
    timestamp: '10m ago',
    isRead: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'Category Alert',
    message: 'Food & Dining expenses reached 85% of average.',
    timestamp: '2h ago',
    isRead: false,
    type: 'warning',
  },
  {
    id: '3',
    title: 'System Update',
    message: 'TrackWise Analytics widgets are now live.',
    timestamp: '1d ago',
    isRead: false,
    type: 'success',
  },
];

/**
 * NavbarNotifications — Interactive notification bell icon button with unread count badge,
 * popover list, mark-all-read action, empty state fallback, and outside-click dismissal.
 */
export const NavbarNotifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Outside click listener to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
      case 'success':
        return <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Notification Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
      >
        <Bell className="h-4 w-4 transition-transform duration-200 hover:scale-110" />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-white font-bold text-[10px] ring-2 ring-background animate-in fade-in zoom-in-75 duration-150">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[320px] sm:w-[360px] bg-card border border-border/70 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md px-1.5 py-0.5"
              >
                <Check className="h-3 w-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List or Empty State */}
          <div className="max-h-[320px] overflow-y-auto divide-y divide-border/40">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 flex items-start gap-3 transition-colors ${
                    item.isRead ? 'bg-card' : 'bg-primary/5 dark:bg-primary/10'
                  } hover:bg-muted/50`}
                >
                  <div className="p-1.5 rounded-lg bg-muted/60 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
                <Bell className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-xs font-semibold text-muted-foreground">No new notifications</p>
                <p className="text-[11px] text-muted-foreground/70">
                  You are all caught up! Check back later for updates.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-border/60 bg-muted/20 text-center">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarNotifications;
