import React from 'react';
import type { TransactionType } from '@/types/transaction';
import { RotateCcw, ArrowUpDown } from 'lucide-react';
import CategorySearch from './CategorySearch';

export type UsageFilter = 'ALL' | 'USED' | 'UNUSED';
export type SortOption = 'ALPHABETICAL' | 'MOST_USED' | 'NEWEST' | 'OLDEST';

export interface CategoryFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  typeFilter: TransactionType | 'ALL';
  onTypeFilterChange: (type: TransactionType | 'ALL') => void;
  usageFilter: UsageFilter;
  onUsageFilterChange: (usage: UsageFilter) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  onReset: () => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  usageFilter,
  onUsageFilterChange,
  sortBy,
  onSortByChange,
  onReset,
}) => {
  const hasActiveFilters =
    Boolean(search) ||
    typeFilter !== 'ALL' ||
    usageFilter !== 'ALL' ||
    sortBy !== 'ALPHABETICAL';

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input (5 cols) */}
        <div className="md:col-span-5">
          <CategorySearch value={search} onChange={onSearchChange} />
        </div>

        {/* Type Filter Select (2 cols) */}
        <div className="md:col-span-2">
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value as TransactionType | 'ALL')}
            aria-label="Filter category type"
            className="w-full h-[38px] px-3 py-2 bg-background border border-input rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="ALL">All Types</option>
            <option value="INCOME">Income Only</option>
            <option value="EXPENSE">Expense Only</option>
          </select>
        </div>

        {/* Usage Filter Select (2 cols) */}
        <div className="md:col-span-2">
          <select
            value={usageFilter}
            onChange={(e) => onUsageFilterChange(e.target.value as UsageFilter)}
            aria-label="Filter usage state"
            className="w-full h-[38px] px-3 py-2 bg-background border border-input rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="ALL">All Usage</option>
            <option value="USED">Used (In Txns)</option>
            <option value="UNUSED">Unused</option>
          </select>
        </div>

        {/* Sort Select (3 cols) */}
        <div className="md:col-span-3 flex items-center gap-2">
          <div className="relative w-full">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortOption)}
              aria-label="Sort categories"
              className="w-full h-[38px] pl-3 pr-8 py-2 bg-background border border-input rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
            >
              <option value="ALPHABETICAL">Alphabetical (A-Z)</option>
              <option value="MOST_USED">Most Used First</option>
              <option value="NEWEST">Recently Created</option>
              <option value="OLDEST">Oldest First</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              title="Clear all active category filters"
              className="inline-flex items-center justify-center h-[38px] px-3 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;
