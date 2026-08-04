import React from 'react';
import { Search, X } from 'lucide-react';
import type { PeriodFilter, StatusFilter } from '@/hooks/useBudgets';

export interface BudgetFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  periodFilter: PeriodFilter;
  onPeriodFilterChange: (v: PeriodFilter) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (v: StatusFilter) => void;
  onReset: () => void;
}

const PERIOD_OPTIONS: { label: string; value: PeriodFilter }[] = [
  { label: 'All Periods', value: 'ALL' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Yearly', value: 'YEARLY' },
];

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'On Track', value: 'ON_TRACK' },
  { label: 'At Risk', value: 'AT_RISK' },
  { label: 'Over Budget', value: 'OVER_BUDGET' },
];

const selectClass =
  'h-9 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer appearance-none pr-8 bg-no-repeat bg-[length:16px_16px] bg-[right_10px_center]';

export const BudgetFilters: React.FC<BudgetFiltersProps> = ({
  search,
  onSearchChange,
  periodFilter,
  onPeriodFilterChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
}) => {
  const hasActiveFilters = Boolean(search || periodFilter !== 'ALL' || statusFilter !== 'ALL');

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            id="budget-search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search budgets..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/80 bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        {/* Period Filter */}
        <div className="relative">
          <select
            id="budget-period-filter"
            value={periodFilter}
            onChange={(e) => onPeriodFilterChange(e.target.value as PeriodFilter)}
            className={selectClass}
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            id="budget-status-filter"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
            className={selectClass}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            title="Reset all filters"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-semibold transition-colors shrink-0"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BudgetFilters;
