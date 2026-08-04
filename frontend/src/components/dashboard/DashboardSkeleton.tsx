import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" data-testid="dashboard-skeleton">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted rounded-md" />
          <div className="h-4 w-36 bg-muted/60 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-muted rounded-full" />
          <div className="h-5 w-24 bg-muted rounded-md hidden sm:block" />
        </div>
      </div>

      {/* 4 Summary Cards Skeleton (Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="p-6 bg-card border border-border/60 rounded-xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-8 w-8 bg-muted/60 rounded-lg" />
            </div>
            <div className="h-8 w-32 bg-muted rounded-md" />
            <div className="h-3 w-20 bg-muted/40 rounded" />
          </div>
        ))}
      </div>

      {/* Middle Section: Quick Actions & Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 p-6 bg-card border border-border/60 rounded-xl shadow-sm space-y-4">
          <div className="h-5 w-32 bg-muted rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="h-11 w-full bg-muted/60 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 p-6 bg-card border border-border/60 rounded-xl shadow-sm space-y-4">
          <div className="h-5 w-40 bg-muted rounded-md" />
          <div className="h-40 w-full bg-muted/40 rounded-lg" />
        </div>
      </div>

      {/* Recent Transactions Skeleton */}
      <div className="bg-card border border-border/60 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-40 bg-muted rounded-md" />
          <div className="h-4 w-20 bg-muted/60 rounded-md" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex justify-between items-center py-2 border-b border-border/30">
              <div className="space-y-1">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted/40 rounded" />
              </div>
              <div className="h-5 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
