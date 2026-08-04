import React from 'react';
import type { Category, TransactionType } from '@/types/transaction';
import { RotateCcw, Calendar, ArrowUpDown } from 'lucide-react';
import TransactionSearch from './TransactionSearch';

export interface TransactionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: TransactionType | '';
  onTypeChange: (value: TransactionType | '') => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: Category[];
  startDate: string;
  endDate: string;
  onDateRangeChange: (start: string, end: string) => void;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  onReset: () => void;
  isLoadingCategories?: boolean;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  categories,
  startDate,
  endDate,
  onDateRangeChange,
  sortBy,
  sortDir,
  onSortChange,
  onReset,
  isLoadingCategories = false,
}) => {
  const hasActiveFilters =
    Boolean(search) ||
    Boolean(selectedType) ||
    Boolean(selectedCategory) ||
    Boolean(startDate) ||
    Boolean(endDate) ||
    sortBy !== 'date' ||
    sortDir !== 'desc';

  const sortCombinedValue = `${sortBy}-${sortDir}`;

  const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sb, sd] = e.target.value.split('-');
    onSortChange(sb, sd as 'asc' | 'desc');
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Bar: Search + Main Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Component (5 cols on md+) */}
        <div className="md:col-span-5">
          <TransactionSearch value={search} onChange={onSearchChange} />
        </div>

        {/* Type Select (2 cols) */}
        <div className="md:col-span-2">
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as TransactionType | '')}
            aria-label="Filter by type"
            className="w-full h-[38px] px-3 py-2 bg-background border border-input rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>

        {/* Category Select (3 cols) */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={isLoadingCategories}
            aria-label="Filter by category"
            className="w-full h-[38px] px-3 py-2 bg-background border border-input rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type})
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select (2 cols) */}
        <div className="md:col-span-2">
          <div className="relative">
            <select
              value={sortCombinedValue}
              onChange={handleSortSelect}
              aria-label="Sort transactions"
              className="w-full h-[38px] pl-3 pr-8 py-2 bg-background border border-input rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom Bar: Date Range Pickers & Clear Filters Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Date Range:</span>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onDateRangeChange(e.target.value, endDate)}
            aria-label="Start date"
            className="h-8 px-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-xs"
          />
          <span className="text-muted-foreground">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onDateRangeChange(startDate, e.target.value)}
            aria-label="End date"
            className="h-8 px-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-xs"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;
