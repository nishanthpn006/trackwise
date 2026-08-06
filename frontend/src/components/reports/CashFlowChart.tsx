import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ReportTrendPoint } from '@/types/report';
import { formatCurrency } from '@/utils/currency';

interface CashFlowChartProps {
  data: ReportTrendPoint[];
  isLoading?: boolean;
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({ data, isLoading }) => {
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
        <h4 className="text-sm font-semibold text-foreground">No Cash Flow Data</h4>
        <p className="text-xs text-muted-foreground mt-1">No transactions recorded for cash flow analysis.</p>
      </div>
    );
  }


  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-xs flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Cash Flow Timeline</h3>
          <p className="text-xs text-muted-foreground">Cumulative cash inflow and outflow streams</p>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <Tooltip
              formatter={(value: unknown) => [formatCurrency(Number(value || 0))]}
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
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#incomeGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#expenseGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlowChart;
