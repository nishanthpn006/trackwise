import React, { useState } from 'react';
import type { DashboardPeriod } from '@/types/dashboard';
import { Calendar, ChevronDown, Check } from 'lucide-react';

export interface DashboardPeriodSelectorProps {
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  startDate?: string;
  endDate?: string;
  onCustomDateChange?: (startDate: string, endDate: string) => void;
}

const PERIOD_LABELS: Record<Exclude<DashboardPeriod, 'CUSTOM'>, string> = {
  THIS_MONTH: 'This Month',
  LAST_MONTH: 'Last Month',
  ALL_TIME: 'All Time',
};

export const DashboardPeriodSelector: React.FC<DashboardPeriodSelectorProps> = ({
  period,
  onPeriodChange,
  startDate = '',
  endDate = '',
  onCustomDateChange,
}) => {
  const [isCustomOpen, setIsCustomOpen] = useState<boolean>(period === 'CUSTOM');
  const [customStart, setCustomStart] = useState<string>(startDate);
  const [customEnd, setCustomEnd] = useState<string>(endDate);

  const handlePeriodClick = (p: DashboardPeriod) => {
    if (p === 'CUSTOM') {
      setIsCustomOpen(true);
      onPeriodChange('CUSTOM');
    } else {
      setIsCustomOpen(false);
      onPeriodChange(p);
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStart && customEnd && onCustomDateChange) {
      onCustomDateChange(customStart, customEnd);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      {/* Pill group */}
      <div className="inline-flex items-center p-1 bg-muted/60 dark:bg-muted/30 border border-border/60 rounded-xl shadow-2xs">
        {(['THIS_MONTH', 'LAST_MONTH', 'ALL_TIME'] as const).map((p) => {
          const isActive = period === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => handlePeriodClick(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? 'bg-card text-foreground shadow-2xs font-bold border border-border/40'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => handlePeriodClick('CUSTOM')}
          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            period === 'CUSTOM'
              ? 'bg-card text-foreground shadow-2xs font-bold border border-border/40'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
          }`}
        >
          <Calendar className="h-3 w-3" />
          <span>Custom</span>
          <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${isCustomOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Custom range input dropdown/inline */}
      {isCustomOpen && (
        <form
          onSubmit={handleApplyCustom}
          className="flex flex-wrap items-center gap-2 p-2 bg-card border border-border/70 rounded-xl shadow-xs text-xs"
        >
          <div className="flex items-center gap-1.5">
            <label htmlFor="custom-start-date" className="text-[10px] uppercase font-bold text-muted-foreground">
              From
            </label>
            <input
              id="custom-start-date"
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2 py-1 bg-background border border-border/60 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="flex items-center gap-1.5">
            <label htmlFor="custom-end-date" className="text-[10px] uppercase font-bold text-muted-foreground">
              To
            </label>
            <input
              id="custom-end-date"
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2 py-1 bg-background border border-border/60 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <Check className="h-3 w-3" />
            <span>Apply</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default DashboardPeriodSelector;
