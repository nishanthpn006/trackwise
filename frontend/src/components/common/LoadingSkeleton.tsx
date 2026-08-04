import React from 'react';

export interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

/**
 * Skeleton — Generic pulse loading box primitive.
 */
export const Skeleton: React.FC<LoadingSkeletonProps> = ({ className = '' }) => (
  <div className={`bg-muted/50 animate-pulse rounded-lg ${className}`} />
);

/**
 * SkeletonCard — Skeleton card grid item.
 */
export const SkeletonCard: React.FC<LoadingSkeletonProps> = ({ className = '' }) => (
  <div className={`bg-card border border-border/60 rounded-xl p-5 space-y-3 shadow-xs ${className}`}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-7 w-36" />
    <Skeleton className="h-3 w-24" />
  </div>
);

/**
 * SkeletonTable — Skeleton table loader rows.
 */
export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3 py-2">
    {Array.from({ length: rows }).map((_, idx) => (
      <div key={idx} className="h-12 bg-muted/40 animate-pulse rounded-lg w-full" />
    ))}
  </div>
);

export default Skeleton;
