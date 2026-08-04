import React from 'react';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import type { DateRangePreset } from '@/types/report';

interface DateRangePickerProps {
  preset: DateRangePreset;
  onPresetChange: (preset: DateRangePreset) => void;
  customStart: string;
  onCustomStartChange: (start: string) => void;
  customEnd: string;
  onCustomEndChange: (end: string) => void;
}

const PRESETS: { label: string; value: DateRangePreset }[] = [
  { label: 'Today', value: 'TODAY' },
  { label: 'Yesterday', value: 'YESTERDAY' },
  { label: 'Last 7 Days', value: 'LAST_7_DAYS' },
  { label: 'Last 30 Days', value: 'LAST_30_DAYS' },
  { label: 'Last 90 Days', value: 'LAST_90_DAYS' },
  { label: 'This Month', value: 'THIS_MONTH' },
  { label: 'Last Month', value: 'LAST_MONTH' },
  { label: 'This Year', value: 'THIS_YEAR' },
  { label: 'Custom Range', value: 'CUSTOM' },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  preset,
  onPresetChange,
  customStart,
  onCustomStartChange,
  customEnd,
  onCustomEndChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-xs">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Filter className="w-4 h-4 text-primary" />
        <span>Date Filter:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onPresetChange(p.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              preset === p.value
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset === 'CUSTOM' && (
        <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <CalendarIcon className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="date"
              value={customStart}
              onChange={(e) => onCustomStartChange(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>
          <span className="text-xs text-muted-foreground">to</span>
          <div className="relative">
            <CalendarIcon className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="date"
              value={customEnd}
              onChange={(e) => onCustomEndChange(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
