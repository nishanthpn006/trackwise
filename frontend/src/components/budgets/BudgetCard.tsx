import React from 'react';
import type { Budget } from '@/types/budget';
import { getBudgetStatus, getBudgetPercent } from '@/hooks/useBudgets';
import { Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

export interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const PERIOD_LABELS: Record<string, string> = {
  MONTHLY: 'Monthly',
  WEEKLY: 'Weekly',
  YEARLY: 'Yearly',
};

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit, onDelete }) => {
  const status = getBudgetStatus(budget);
  const percent = getBudgetPercent(budget);
  const remaining = budget.amount - budget.spent;

  const statusConfig = {
    ON_TRACK: {
      barColor: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      topBorder: '#10B981',
      label: 'On Track',
    },
    AT_RISK: {
      barColor: 'bg-amber-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      topBorder: '#F59E0B',
      label: 'At Risk',
    },
    OVER_BUDGET: {
      barColor: 'bg-rose-500',
      textColor: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      topBorder: '#F43F5E',
      label: 'Over Budget',
    },
  }[status];

  const categoryColor = budget.categoryColor || '#6366F1';

  return (
    <div
      className="group relative bg-card border border-border/80 rounded-2xl p-5 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-out flex flex-col justify-between space-y-4 overflow-hidden"
      style={{ borderTop: `4px solid ${statusConfig.topBorder}` }}
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-foreground tracking-tight truncate pr-2">
              {budget.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {/* Period badge */}
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {PERIOD_LABELS[budget.period] ?? budget.period}
              </span>
              {/* Status badge */}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Category pill */}
        {budget.categoryName && (
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
            style={{
              backgroundColor: `${categoryColor}18`,
              color: categoryColor,
              border: `1px solid ${categoryColor}30`,
            }}
          >
            <Tag className="h-3 w-3" />
            <span>{budget.categoryName}</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {formatCurrency(budget.spent)} spent
            </span>
            <span className={`font-bold ${statusConfig.textColor}`}>{percent}%</span>
          </div>
          <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${statusConfig.barColor}`}
              style={{ width: `${Math.min(100, percent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              {remaining >= 0
                ? `${formatCurrency(remaining)} remaining`
                : `${formatCurrency(Math.abs(remaining))} over budget`}
            </span>
            <span>of {formatCurrency(budget.amount)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t border-border/30">
        <div className="flex items-center gap-1 text-[11px]">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(budget.startDate)} – {formatDate(budget.endDate)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(budget)}
            aria-label={`Edit ${budget.name}`}
            title="Edit Budget"
            className="p-1.5 rounded-lg border border-border/60 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(budget)}
            aria-label={`Delete ${budget.name}`}
            title="Delete Budget"
            className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
