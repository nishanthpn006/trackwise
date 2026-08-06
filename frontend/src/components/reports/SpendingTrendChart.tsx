import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ReportTrendPoint } from '@/types/report';
import { formatCurrency } from '@/utils/currency';

interface SpendingTrendChartProps {
  data: ReportTrendPoint[];
  isLoading?: boolean;
}

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-80 rounded-xl bg-card border border-border p-5 flex items-center justify-center animate-pulse">
        <div className="h-48 w-full bg-muted/40 rounded-lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 rounded-xl bg-card border border-border p-5 flex flex-col items-center justify-center text-center">
        <h4 className="text-sm font-semibold text-foreground">No Spending Trend</h4>
        <p className="text-xs text-muted-foreground mt-1">No spending data recorded for this period.</p>
      </div>
    );
  }


  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-xs flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Spending Trend</h3>
          <p className="text-xs text-muted-foreground">Daily/Monthly expenditure trajectory</p>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value || 0)), 'Spent']}
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--foreground)',
              }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingTrendChart;
