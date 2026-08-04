import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface DashboardErrorCardProps {
  message?: string;
  onRetry: () => void;
}

/**
 * DashboardErrorCard — Inline error banner component displaying error state with retry button.
 */
export const DashboardErrorCard: React.FC<DashboardErrorCardProps> = ({
  message = 'Failed to load dashboard summary data. Please try again.',
  onRetry,
}) => {
  return (
    <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold border border-destructive/20 flex items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center gap-2 min-w-0">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span className="truncate">{message}</span>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-[11px] font-bold hover:bg-destructive/90 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RefreshCw className="h-3 w-3" />
        <span>Retry</span>
      </button>
    </div>
  );
};

export default DashboardErrorCard;
