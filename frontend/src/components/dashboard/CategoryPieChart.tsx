import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import type { CategoryBreakdownItem } from '@/types/dashboard';
import { formatCurrency } from '@/utils/currency';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: CategoryBreakdownItem }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-card border border-border/60 rounded-xl shadow-lg p-3 text-xs space-y-1 min-w-[160px]">
      <p className="font-semibold text-foreground">{item.categoryName}</p>
      <p className="text-muted-foreground">{formatCurrency(item.amount)}</p>
      <p className="text-muted-foreground">{item.percentage.toFixed(1)}% of expenses</p>
    </div>
  );
};

export interface CategoryPieChartProps {
  data: CategoryBreakdownItem[];
  subtitle?: string;
}

/**
 * CategoryPieChart — Donut chart showing expense distribution by category.
 * Shows a legend list alongside the chart with truncation for many categories.
 */
export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data, subtitle = 'Period spending breakdown' }) => {
  // Cap the legend at 6 items; group the rest as "Other"
  const chartData = useMemo(() => {
    if (data.length <= 6) return data;
    const top = data.slice(0, 5);
    const otherAmount = data.slice(5).reduce((acc: number, d: CategoryBreakdownItem) => acc + d.amount, 0);
    const otherPct = data.slice(5).reduce((acc: number, d: CategoryBreakdownItem) => acc + d.percentage, 0);
    return [
      ...top,
      { categoryName: 'Other', color: '#94a3b8', amount: otherAmount, percentage: otherPct },
    ];
  }, [data]);

  return (
    <div className="bg-card border border-border/60 rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow duration-200">
      {/* Card header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground tracking-tight">Expense by Category</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
          <PieIcon className="h-4 w-4" />
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="flex items-center gap-4">
          {/* Donut chart */}
          <div className="shrink-0">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  strokeWidth={2}
                  stroke="hsl(var(--card))"
                >
                  {chartData.map((entry: CategoryBreakdownItem, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {chartData.map((item: CategoryBreakdownItem) => (
              <div key={item.categoryName} className="flex items-center gap-2 group">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color || '#6366f1' }}
                />
                <span className="text-[11px] text-muted-foreground truncate flex-1 group-hover:text-foreground transition-colors">
                  {item.categoryName}
                </span>
                <span className="text-[11px] font-semibold text-foreground shrink-0 tabular-nums">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[140px] text-center">
          <PieIcon className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground font-medium">No expense data</p>
          <p className="text-[11px] text-muted-foreground/70 mt-1">Add expense transactions to see category breakdown.</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(CategoryPieChart);

