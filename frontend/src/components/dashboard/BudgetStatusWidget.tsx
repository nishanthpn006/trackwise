import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router';
import { PiggyBank, ArrowRight, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import budgetService from '@/services/budgetService';
import type { Budget } from '@/types/budget';
import { formatCurrency } from '@/utils/currency';

interface BudgetStatusWidgetProps {
  refreshKey?: number;
}

/**
 * BudgetStatusWidget — Dashboard widget surfacing live budget status from `/api/budgets`.
 * Categorizes budgets into:
 * - On track (< 80% used)
 * - Approaching limit (80%–99% used)
 * - Exceeded (>= 100% used)
 */
export const BudgetStatusWidget: React.FC<BudgetStatusWidgetProps> = ({ refreshKey = 0 }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchBudgets = async () => {
      setIsLoading(true);
      try {
        const data = await budgetService.getBudgets();
        if (isMounted) {
          setBudgets(data);
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchBudgets();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Sort and prioritize budgets: Exceeded first, then Approaching Limit, then On Track
  const prioritizedBudgets = useMemo(() => {
    return [...budgets]
      .map((b) => {
        const spent = Number(b.spent) || 0;
        const total = Number(b.amount) || 1;
        const percentage = Math.round((spent / total) * 100);
        const status =
          percentage >= 100
            ? ('EXCEEDED' as const)
            : percentage >= 80
            ? ('WARNING' as const)
            : ('ON_TRACK' as const);
        return { ...b, spent, total, percentage, status };
      })
      .sort((a, b) => {
        const order = { EXCEEDED: 0, WARNING: 1, ON_TRACK: 2 };
        if (order[a.status] !== order[b.status]) {
          return order[a.status] - order[b.status];
        }
        return b.percentage - a.percentage;
      })
      .slice(0, 3); // Surface top 3 most important
  }, [budgets]);

  if (isLoading) {
    return (
      <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3">
        <div className="h-4 w-32 rounded-md tw-animate-shimmer" />
        <div className="h-16 rounded-xl tw-animate-shimmer" />
        <div className="h-16 rounded-xl tw-animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <PiggyBank className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-foreground">
              Budget Status
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {budgets.length} active spending {budgets.length === 1 ? 'limit' : 'limits'}
            </p>
          </div>
        </div>
        <Link
          to="/budgets"
          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Budget list */}
      {prioritizedBudgets.length === 0 ? (
        <div className="text-center py-5 px-3 rounded-xl border border-dashed border-border/70 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">No budgets created for this month.</p>
          <Link
            to="/budgets"
            className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
          >
            <span>Set a monthly budget</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {prioritizedBudgets.map((budget) => {
            const isExceeded = budget.status === 'EXCEEDED';
            const isWarning = budget.status === 'WARNING';

            const badgeBg = isExceeded
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
              : isWarning
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

            const progressBg = isExceeded
              ? 'bg-rose-500'
              : isWarning
              ? 'bg-amber-500'
              : 'bg-emerald-500';

            return (
              <div
                key={budget.id}
                className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-2"
              >
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-bold text-foreground truncate">{budget.name}</span>
                    {budget.categoryName && (
                      <span className="text-[10px] text-muted-foreground truncate">
                        • {budget.categoryName}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${badgeBg}`}
                  >
                    {isExceeded ? (
                      <>
                        <AlertCircle className="h-2.5 w-2.5" />
                        <span>Exceeded</span>
                      </>
                    ) : isWarning ? (
                      <>
                        <AlertTriangle className="h-2.5 w-2.5" />
                        <span>Approaching limit</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        <span>On track</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${progressBg}`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={budget.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-muted-foreground font-mono">
                  <span>
                    {formatCurrency(budget.spent)} of {formatCurrency(budget.total)}
                  </span>
                  <span className="font-semibold text-foreground">{budget.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetStatusWidget;
