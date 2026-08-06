import React from 'react';
import type { BudgetStatsSummary } from '@/types/budget';
import {
  PiggyBank,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/common/LoadingSkeleton';
import { formatCurrency } from '@/utils/currency';

export interface BudgetStatsProps {
  stats: BudgetStatsSummary;
  isLoading?: boolean;
}

export const BudgetStats: React.FC<BudgetStatsProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-card border border-border/60 rounded-2xl p-3.5 space-y-2 shadow-xs">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }

  const spentPercent =
    stats.totalAllocated > 0
      ? Math.min(100, Math.round((stats.totalSpent / stats.totalAllocated) * 100))
      : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Total Budgets */}
      <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Budgets</span>
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <PiggyBank className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className="text-xl font-bold tracking-tight text-foreground">{stats.totalBudgets}</p>
      </div>

      {/* Total Allocated */}
      <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Allocated</span>
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <IndianRupee className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className="text-sm font-bold tracking-tight text-foreground truncate">{formatCurrency(stats.totalAllocated)}</p>
      </div>

      {/* Total Spent */}
      <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Spent</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-foreground truncate">{formatCurrency(stats.totalSpent)}</p>
          <span className="text-[10px] text-muted-foreground">{spentPercent}% of budget</span>
        </div>
      </div>

      {/* Over Budget */}
      <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Over Budget</span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className={`text-xl font-bold tracking-tight ${stats.overBudgetCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-foreground'}`}>
          {stats.overBudgetCount}
        </p>
      </div>

      {/* At Risk */}
      <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">At Risk</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className={`text-xl font-bold tracking-tight ${stats.atRiskCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
          {stats.atRiskCount}
        </p>
      </div>

      {/* On Track */}
      <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">On Track</span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className={`text-xl font-bold tracking-tight ${stats.onTrackCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
          {stats.onTrackCount}
        </p>
      </div>
    </div>
  );
};

export default BudgetStats;
