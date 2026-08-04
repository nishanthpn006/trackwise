import React from 'react';

/**
 * DashboardSummarySkeleton — Pulse skeleton card grid loader matching the exact 8-card summary layout.
 * Used during data fetching to prevent layout shifts and avoid displaying placeholder zeros.
 */
export const DashboardSummarySkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Loading dashboard summary">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 bg-card border border-border/60 rounded-xl shadow-2xs space-y-3 animate-pulse h-[116px] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-24 bg-muted/80 rounded-md" />
            <div className="h-8 w-8 bg-muted/80 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <div className="h-7 w-32 bg-muted/80 rounded-lg" />
            <div className="h-3 w-28 bg-muted/60 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummarySkeleton;
