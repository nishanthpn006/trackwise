import React from 'react';
import { BellOff, RefreshCw } from 'lucide-react';

interface NotificationEmptyStateProps {
  onRefresh?: () => void;
  message?: string;
}

export const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
  onRefresh,
  message = 'No notifications available.',
}) => {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-3">
      <div className="p-4 rounded-full bg-muted/30 border border-border/50 text-muted-foreground">
        <BellOff className="w-8 h-8 stroke-1" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-foreground">{message}</h4>
        <p className="text-[11px] text-muted-foreground max-w-xs">
          You are all caught up! System alerts and reminders will appear here automatically.
        </p>
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      )}
    </div>
  );
};

export default NotificationEmptyState;
