import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { MonthlyDataPoint } from '@/types/dashboard';

interface IncomeExpenseChartProps {
  data: MonthlyDataPoint[];
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/60 rounded-xl shadow-lg p-3 text-xs space-y-1.5 min-w-[140px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className="font-semibold text-foreground">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * IncomeExpenseChart — Bar chart comparing monthly income vs expense over the last 6 months.
 * Uses Recharts BarChart with grouped bars; tooltip and legend are customised.
 */
export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
  const hasData = useMemo(() => data.some((d) => d.income > 0 || d.expense > 0), [data]);

  return (
    <div className="bg-card border border-border/60 rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow duration-200">
      {/* Card header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground tracking-tight">Monthly Income vs Expense</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Last 6 months comparison</p>
        </div>
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
          <BarChart3 className="h-4 w-4" />
        </div>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barGap={4} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)', radius: 4 }} />
            <Legend
              iconType="square"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, paddingTop: 12, color: 'hsl(var(--muted-foreground))' }}
            />
            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-[220px] text-center">
          <BarChart3 className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground font-medium">No transactions yet</p>
          <p className="text-[11px] text-muted-foreground/70 mt-1">Add income or expense transactions to see your trends.</p>
        </div>
      )}
    </div>
  );
};

export default IncomeExpenseChart;
