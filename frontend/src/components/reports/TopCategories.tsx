import React from 'react';
import { Tag, TrendingUp } from 'lucide-react';
import type { ReportCategoryBreakdown } from '@/types/report';
import { formatCurrency } from '@/utils/currency';

interface TopCategoriesProps {
  categories: ReportCategoryBreakdown[];
  isLoading?: boolean;
}

export const TopCategories: React.FC<TopCategoriesProps> = ({ categories, isLoading }) => {

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card border border-border p-5 animate-pulse space-y-3">
        <div className="h-4 w-32 bg-muted rounded mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted/40 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-5 text-center text-muted-foreground text-xs py-8">
        No top categories recorded for this filter.
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Top Spending Categories</h3>
          <p className="text-xs text-muted-foreground">Ranked by total expense volume</p>
        </div>
        <TrendingUp className="w-4 h-4 text-primary" />
      </div>

      <div className="space-y-3">
        {categories.slice(0, 10).map((cat, idx) => {
          const color = cat.color || '#3b82f6';
          return (
            <div key={idx} className="flex items-center justify-between gap-3 text-xs p-2 rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="font-bold text-muted-foreground w-4 text-center">{idx + 1}</span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold shrink-0"
                  style={{ backgroundColor: color }}
                >
                  <Tag className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between font-semibold text-foreground">
                    <span className="truncate">{cat.categoryName}</span>
                    <span>{formatCurrency(cat.amount)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, cat.percentage)}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              </div>
              <span className="font-semibold text-muted-foreground shrink-0 w-12 text-right">
                {cat.percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopCategories;
