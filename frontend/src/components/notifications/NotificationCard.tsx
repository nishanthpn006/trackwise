import React from 'react';
import type { NotificationItem, NotificationType } from '@/types/notification';
import {
  Wallet,
  Target,
  AlertTriangle,
  Calendar,
  ShieldAlert,
  CheckCircle,
  Bell,
  Trash2,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router';

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  onDelete,
  isUpdating,
}) => {
  const getIconAndStyle = (type: NotificationType) => {
    switch (type) {
      case 'BUDGET_ALERT':
      case 'OVERSPENDING_ALERT':
        return { icon: Wallet, bg: 'bg-amber-500/10', text: 'text-amber-600' };
      case 'GOAL_MILESTONE':
      case 'GOAL_COMPLETED':
      case 'GOAL_ACHIEVED':
        return { icon: Target, bg: 'bg-emerald-500/10', text: 'text-emerald-600' };
      case 'GOAL_OVERDUE':
        return { icon: AlertTriangle, bg: 'bg-rose-500/10', text: 'text-rose-600' };
      case 'MONTHLY_SUMMARY':
      case 'WEEKLY_SUMMARY':
        return { icon: Calendar, bg: 'bg-purple-500/10', text: 'text-purple-600' };
      case 'SECURITY_ALERT':
        return { icon: ShieldAlert, bg: 'bg-rose-500/10', text: 'text-rose-600' };
      case 'TRANSACTION_SUCCESS':
        return { icon: CheckCircle, bg: 'bg-emerald-500/10', text: 'text-emerald-600' };
      default:
        return { icon: Bell, bg: 'bg-primary/10', text: 'text-primary' };
    }
  };

  const getPriorityTag = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-500/15 text-rose-600 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/15 text-amber-600 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-primary/15 text-primary border-primary/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
      if (diffSec < 60) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const { icon: Icon, bg, text } = getIconAndStyle(notification.type);

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all relative flex items-start gap-3 ${
        notification.isRead
          ? 'bg-card/60 border-border/50 opacity-80'
          : 'bg-card border-primary/30 shadow-xs ring-1 ring-primary/10'
      }`}
    >
      {/* Type Icon */}
      <div className={`p-2 rounded-xl shrink-0 ${bg} ${text} mt-0.5`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-foreground truncate pr-2">
            {notification.title}
          </h4>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${getPriorityTag(
                notification.priority
              )}`}
            >
              {notification.priority}
            </span>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            )}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
          {notification.message}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-muted-foreground font-medium">
            {formatTimeAgo(notification.createdAt)}
          </span>

          <div className="flex items-center gap-1">
            {notification.actionUrl && (
              <Link
                to={notification.actionUrl}
                className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline px-2 py-0.5 rounded-lg hover:bg-primary/10"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}

            {!notification.isRead && (
              <button
                type="button"
                onClick={() => onMarkRead(notification.id)}
                disabled={isUpdating}
                title="Mark as read"
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              disabled={isUpdating}
              title="Delete notification"
              className="p-1 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
