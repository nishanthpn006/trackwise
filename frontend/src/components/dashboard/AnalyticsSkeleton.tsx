import React from 'react';

/**
 * AnalyticsSkeleton — Pulse skeleton placeholder rendered while analytics data loads.
 * Mirrors the final 2×2 chart grid layout to prevent layout shift.
 */
export const AnalyticsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-pulse" data-testid="analytics-skeleton">
    {/* Bar chart skeleton */}
    <div className="bg-card border border-border/60 rounded-xl p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-48 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted/60 rounded" />
        </div>
        <div className="h-8 w-8 bg-muted/60 rounded-lg" />
      </div>
      <div className="flex items-end gap-2 h-40 pt-4">
        {[65, 90, 55, 80, 45, 70].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col gap-1 items-center justify-end">
            <div className="w-full bg-muted/60 rounded-t" style={{ height: `${h}%` }} />
            <div className="w-full bg-muted/40 rounded-t" style={{ height: `${100 - h}%` }} />
          </div>
        ))}
      </div>
      <div className="flex gap-4 justify-center">
        <div className="h-3 w-16 bg-muted/60 rounded" />
        <div className="h-3 w-16 bg-muted/40 rounded" />
      </div>
    </div>

    {/* Pie chart skeleton */}
    <div className="bg-card border border-border/60 rounded-xl p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-44 bg-muted rounded" />
          <div className="h-3 w-28 bg-muted/60 rounded" />
        </div>
        <div className="h-8 w-8 bg-muted/60 rounded-lg" />
      </div>
      <div className="flex items-center gap-6">
        <div className="h-32 w-32 rounded-full bg-muted/40 shrink-0" />
        <div className="flex-1 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-muted/60 shrink-0" />
              <div className="h-3 bg-muted/40 rounded flex-1" />
              <div className="h-3 w-10 bg-muted/60 rounded shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Line chart skeleton */}
    <div className="bg-card border border-border/60 rounded-xl p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-40 bg-muted rounded" />
          <div className="h-3 w-36 bg-muted/60 rounded" />
        </div>
        <div className="h-8 w-8 bg-muted/60 rounded-lg" />
      </div>
      <div className="h-40 w-full bg-muted/20 rounded-lg" />
    </div>

    {/* Financial insights skeleton */}
    <div className="bg-card border border-border/60 rounded-xl p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-40 bg-muted rounded" />
          <div className="h-3 w-28 bg-muted/60 rounded" />
        </div>
        <div className="h-8 w-8 bg-muted/60 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-muted/20 rounded-xl p-4 space-y-2">
            <div className="h-3 w-20 bg-muted/60 rounded" />
            <div className="h-6 w-24 bg-muted rounded" />
            <div className="h-2.5 w-16 bg-muted/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AnalyticsSkeleton;
