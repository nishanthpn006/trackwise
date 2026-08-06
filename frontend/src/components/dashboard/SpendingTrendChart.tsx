import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingDown } from 'lucide-react';
import type { SpendingTrendPoint } from '@/types/dashboard';
import { formatCurrency } from '@/utils/currency';

export interface SpendingTrendChartProps {
  data: SpendingTrendPoint[];
}

/** Format ISO date string to short label like "Jan 5" */
const formatDateLabel = (dateStr: string): string => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/60 rounded-xl shadow-lg p-3 text-xs space-y-1 min-w-[130px]">
      <p className="font-semibold text-foreground">{label ? formatDateLabel(label) : ''}</p>
      <p className="text-rose-500 font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

/**
 * SpendingTrendChart — Gradient area chart showing daily expense totals for the last 30 days.
 * Uses Recharts AreaChart with a smooth curve and gradient fill.
 */
export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({ data }) => {
  const hasData = useMemo(() => data.some((d) => d.amount > 0), [data]);

  // Show only every 5th date label to avoid crowding
  const tickFormatter = (value: string, index: number): string =>
    index % 5 === 0 ? formatDateLabel(value) : '';

  return (
    <div className="bg-card border border-border/60 rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow duration-200">
      {/* Card header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground tracking-tight">Spending Trend</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Daily expenses — last 30 days</p>
        </div>
        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
          <TrendingDown className="h-4 w-4" />
        </div>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={185}>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={tickFormatter}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tickFormatter={(v: number) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              width={38}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ef4444', strokeWidth: 1, strokeDasharray: '4 2' }} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#spendingGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#ef4444', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-[185px] text-center">
          <TrendingDown className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground font-medium">No spending data</p>
          <p className="text-[11px] text-muted-foreground/70 mt-1">Expense transactions from the last 30 days will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(SpendingTrendChart);

