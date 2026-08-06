import React from 'react';
import { Sparkles, TrendingUp, Activity, Hash, IndianRupee } from 'lucide-react';
import type { FinancialInsights } from '@/types/dashboard';
import { formatCurrency } from '@/utils/currency';

export interface FinancialInsightsCardProps {
  insights: FinancialInsights;
}

interface InsightTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
}

const InsightTile: React.FC<InsightTileProps> = ({ icon, label, value, sub, valueColor }) => (
  <div className="bg-muted/40 dark:bg-muted/20 rounded-xl p-4 space-y-2 hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors duration-150">
    <div className="flex items-center gap-1.5 text-muted-foreground">
      {icon}
      <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
    </div>
    <p className={`text-lg font-extrabold tracking-tight leading-none ${valueColor ?? 'text-foreground'}`}>
      {value}
    </p>
    {sub && <p className="text-[10px] text-muted-foreground leading-snug">{sub}</p>}
  </div>
);

/**
 * FinancialInsightsCard — 2×2 grid of KPI metric tiles derived from analytics data.
 * Displays: highest spending category, monthly savings %, avg daily spending, and transaction count.
 */
export const FinancialInsightsCard: React.FC<FinancialInsightsCardProps> = ({ insights }) => {
  const savingsPct = Number(insights.monthlySavingsPercentage);
  const savingsColor =
    savingsPct >= 20 ? 'text-emerald-600 dark:text-emerald-400'
    : savingsPct >= 0 ? 'text-amber-600 dark:text-amber-400'
    : 'text-rose-600 dark:text-rose-400';

  const balanceColor =
    insights.currentMonthBalance >= 0
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-rose-600 dark:text-rose-400';

  return (
    <div className="bg-card border border-border/60 rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow duration-200">
      {/* Card header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground tracking-tight">Financial Insights</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Key metrics at a glance</p>
        </div>
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      {/* 2×2 KPI grid */}
      <div className="grid grid-cols-2 gap-3">
        <InsightTile
          icon={<Activity className="h-3 w-3" />}
          label="Top Category"
          value={insights.highestSpendingCategory ?? 'None'}
          sub="Highest all-time spending"
        />

        <InsightTile
          icon={<TrendingUp className="h-3 w-3" />}
          label="Monthly Savings"
          value={`${savingsPct.toFixed(1)}%`}
          sub="of income saved this month"
          valueColor={savingsColor}
        />

        <InsightTile
          icon={<IndianRupee className="h-3 w-3" />}
          label="Avg Daily Spend"
          value={formatCurrency(Number(insights.averageDailySpending))}
          sub="Last 30 days average"
        />

        <InsightTile
          icon={<Hash className="h-3 w-3" />}
          label="This Month"
          value={formatCurrency(Number(insights.currentMonthBalance))}
          sub={`${insights.transactionCount} total transactions`}
          valueColor={balanceColor}
        />
      </div>
    </div>
  );
};

export default FinancialInsightsCard;
