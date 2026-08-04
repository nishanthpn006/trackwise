import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import type { GoalStatus, GoalSortOption } from '@/types/goal';

interface GoalFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: GoalStatus | 'ALL';
  onStatusChange: (status: GoalStatus | 'ALL') => void;
  sortOption: GoalSortOption;
  onSortChange: (sort: GoalSortOption) => void;
  onReset: () => void;
}

export const GoalFilters: React.FC<GoalFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortOption,
  onSortChange,
  onReset,
}) => {
  const isFiltered = searchQuery.trim() !== '' || statusFilter !== 'ALL' || sortOption !== 'TARGET_DATE';

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card/60 p-4 rounded-2xl border border-border/80">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search goals by name or description..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-xs bg-background/80 border border-border/80 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Status Dropdown */}
        <div className="flex items-center space-x-1.5 bg-background/80 border border-border/80 rounded-xl px-3 py-1.5">
          <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground hidden sm:inline shrink-0 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onStatusChange(e.target.value as GoalStatus | 'ALL')
            }
            className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Goals</option>
            <option value="IN_PROGRESS">Active / In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-1.5 bg-background/80 border border-border/80 rounded-xl px-3 py-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground hidden sm:inline shrink-0 font-medium">Sort:</span>
          <select
            value={sortOption}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onSortChange(e.target.value as GoalSortOption)
            }
            className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
          >
            <option value="TARGET_DATE">Target Date (Earliest)</option>
            <option value="HIGHEST_PROGRESS">Highest Progress</option>
            <option value="LOWEST_PROGRESS">Lowest Progress</option>
            <option value="NEWEST">Newest Created</option>
            <option value="OLDEST">Oldest Created</option>
          </select>
        </div>

        {/* Reset Filters */}
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border/80 rounded-xl hover:bg-muted transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default GoalFilters;
