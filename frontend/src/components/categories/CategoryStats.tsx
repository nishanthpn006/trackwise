import React from 'react';
import type { CategoryStatsSummary } from '@/types/category';
import { Tags, ArrowUpRight, ArrowDownRight, Award, CheckCircle2, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/common/LoadingSkeleton';

export interface CategoryStatsProps {
  stats: CategoryStatsSummary;
  isLoading?: boolean;
}

export const CategoryStats: React.FC<CategoryStatsProps> = ({
  stats,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-card border border-border/60 rounded-2xl p-3.5 space-y-2 shadow-xs">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Total Categories */}
      <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total</span>
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Tags className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className="text-xl font-bold tracking-tight text-foreground">{stats.totalCategories}</p>
      </div>

      {/* Income Categories */}
      <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Income</span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
          {stats.incomeCategories}
        </p>
      </div>

      {/* Expense Categories */}
      <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Expense</span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ArrowDownRight className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className="text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
          {stats.expenseCategories}
        </p>
      </div>

      {/* Most Used Category */}
      <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Most Used</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Award className="h-3.5 w-3.5" />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-foreground truncate">
            {stats.mostUsedCategory ? stats.mostUsedCategory.name : 'N/A'}
          </p>
          {stats.mostUsedCategory && (
            <span className="text-[10px] text-muted-foreground">
              {stats.mostUsedCategory.count} txns
            </span>
          )}
        </div>
      </div>

      {/* Unused Categories */}
      <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Unused</span>
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className="text-xl font-bold tracking-tight text-foreground">{stats.unusedCategories}</p>
      </div>

      {/* Categories Used This Month */}
      <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">This Month</span>
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Calendar className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className="text-xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
          {stats.categoriesUsedThisMonth}
        </p>
      </div>
    </div>
  );
};

export default CategoryStats;
