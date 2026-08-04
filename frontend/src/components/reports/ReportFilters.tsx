import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { ReportCategoryBreakdown } from '@/types/report';

interface ReportFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  categories: ReportCategoryBreakdown[];
  onReset: () => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  onReset,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-xl shadow-xs">
      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search categories, transactions, goals..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c, i) => (
            <option key={i} value={c.categoryName}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default ReportFilters;
