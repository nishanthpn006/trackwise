import React from 'react';
import type { NotificationFilters as FilterType } from '@/types/notification';
import { Search } from 'lucide-react';

interface NotificationFiltersProps {
  filters: FilterType;
  onFilterChange: (newFilters: FilterType) => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const tabs = [
    { id: 'ALL', label: 'All', unreadOnly: false, type: undefined },
    { id: 'UNREAD', label: 'Unread', unreadOnly: true, type: undefined },
    { id: 'BUDGET', label: 'Budgets', unreadOnly: false, type: 'BUDGET_ALERT' },
    { id: 'GOAL', label: 'Goals', unreadOnly: false, type: 'GOAL_MILESTONE' },
    { id: 'SUMMARY', label: 'Summaries', unreadOnly: false, type: 'MONTHLY_SUMMARY' },
  ];

  return (
    <div className="space-y-2.5 pb-2">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          placeholder="Search notifications..."
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((t) => {
          const isActive =
            t.id === 'UNREAD'
              ? filters.unreadOnly
              : !filters.unreadOnly && (t.type ? filters.type === t.type : !filters.type);

          return (
            <button
              key={t.id}
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  unreadOnly: t.unreadOnly,
                  type: t.type,
                })
              }
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationFilters;
