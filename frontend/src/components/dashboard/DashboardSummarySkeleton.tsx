import React from 'react';

/**
 * DashboardSummarySkeleton — Pulse skeleton card grid loader matching the exact 8-card summary layout.
 * Used during data fetching to prevent layout shifts and avoid displaying placeholder zeros.
 */
export const DashboardSummarySkeleton: React.FC = () => {
  return (
    <div className="space-y-4" aria-label="Loading dashboard summary">
      {/* Primary 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 bg-card border border-border/60 rounded-xl shadow-2xs space-y-3 tw-animate-shimmer h-[116px] flex flex-col justify-between"
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

      {/* Secondary 3 indicator bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="p-3 bg-card border border-border/50 rounded-xl shadow-2xs flex items-center justify-between gap-2 tw-animate-shimmer h-12"
          >
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-muted/80" />
              <div className="space-y-1">
                <div className="h-2 w-16 bg-muted/70 rounded" />
                <div className="h-3 w-20 bg-muted/80 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSummarySkeleton;
