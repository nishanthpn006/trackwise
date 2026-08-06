import React from 'react';
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
import type { ReportTrendPoint } from '@/types/report';
import { formatCurrency } from '@/utils/currency';

interface IncomeExpenseBarChartProps {
  data: ReportTrendPoint[];
  isLoading?: boolean;
}

export const IncomeExpenseBarChart: React.FC<IncomeExpenseBarChartProps> = ({ data, isLoading }) => {
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
        <h4 className="text-sm font-semibold text-foreground">No Comparison Data</h4>
        <p className="text-xs text-muted-foreground mt-1">No monthly transaction data available.</p>
      </div>
    );
  }


  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-xs flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Income vs Expenses</h3>
          <p className="text-xs text-muted-foreground">Monthly cash flow comparison</p>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value || 0))]}
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--foreground)',
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-xs text-foreground font-medium">{value}</span>}
            />
            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="netCashFlow" name="Net Savings" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseBarChart;
