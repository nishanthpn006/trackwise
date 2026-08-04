import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ReportCategoryBreakdown } from '@/types/report';

interface ExpensePieChartProps {
  data: ReportCategoryBreakdown[];
  isLoading?: boolean;
}

export const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-80 rounded-xl bg-card border border-border p-5 flex items-center justify-center animate-pulse">
        <div className="w-40 h-40 rounded-full border-4 border-muted border-t-primary animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 rounded-xl bg-card border border-border p-5 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
          <span className="text-xl">📊</span>
        </div>
        <h4 className="text-sm font-semibold text-foreground">No Expense Breakdown</h4>
        <p className="text-xs text-muted-foreground mt-1">No expense transactions recorded in this period.</p>
      </div>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-xs flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Expense by Category</h3>
          <p className="text-xs text-muted-foreground">Proportional breakdown of total expenses</p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-md">
          {data.length} Categories
        </span>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              dataKey="amount"
              nameKey="categoryName"
              aria-label="Expense by Category Pie Chart"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value || 0)), 'Amount']}
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--foreground)',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-xs text-foreground font-medium">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpensePieChart;
