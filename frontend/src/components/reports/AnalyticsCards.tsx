import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Calendar,
  Receipt,
  Percent,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import type { ReportSummary } from '@/types/report';
import { formatCurrency } from '@/utils/currency';

interface AnalyticsCardsProps {
  summary: ReportSummary | null;
  isLoading?: boolean;
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ summary, isLoading }) => {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" data-testid="kpi-skeleton">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-card border border-border p-4 animate-pulse">
            <div className="h-4 w-24 bg-muted rounded mb-3" />
            <div className="h-6 w-32 bg-muted rounded mb-2" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      change: '+Income Period',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      badge: 'Income',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      change: '-Expense Period',
      icon: TrendingDown,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10 dark:bg-rose-500/20',
      badge: 'Expense',
    },
    {
      title: 'Net Savings',
      value: formatCurrency(summary.netSavings),
      change: summary.netSavings >= 0 ? 'Surplus' : 'Deficit',
      icon: PiggyBank,
      color: summary.netSavings >= 0 ? 'text-indigo-500' : 'text-amber-500',
      bgColor: summary.netSavings >= 0 ? 'bg-indigo-500/10' : 'bg-amber-500/10',
      badge: 'Net',
    },
    {
      title: 'Avg Daily Spend',
      value: formatCurrency(summary.averageDailySpend),
      change: 'Per Day',
      icon: Calendar,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      badge: 'Daily',
    },
    {
      title: 'Avg Monthly Spend',
      value: formatCurrency(summary.averageMonthlySpend),
      change: 'Per Month',
      icon: Calendar,
      color: 'text-sky-500',
      bgColor: 'bg-sky-500/10',
      badge: 'Monthly',
    },
    {
      title: 'Largest Expense',
      value: formatCurrency(summary.largestExpense),
      change: summary.insights?.largestExpenseTitle || 'Single Peak',
      icon: ArrowDownRight,
      color: 'text-rose-600',
      bgColor: 'bg-rose-600/10',
      badge: 'Peak Out',
    },
    {
      title: 'Largest Income',
      value: formatCurrency(summary.largestIncome),
      change: summary.insights?.largestIncomeTitle || 'Single Peak',
      icon: ArrowUpRight,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-600/10',
      badge: 'Peak In',
    },
    {
      title: 'Transactions Count',
      value: summary.transactionsCount.toString(),
      change: 'Total Entries',
      icon: Receipt,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      badge: 'Count',
    },
    {
      title: 'Savings Rate %',
      value: `${summary.savingsRatePercentage.toFixed(1)}%`,
      change: 'Of Total Income',
      icon: Percent,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
      badge: 'Rate',
    },
    {
      title: 'Budget Utilization %',
      value: `${summary.budgetUtilizationPercentage.toFixed(1)}%`,
      change: 'Of Allocated Budget',
      icon: Wallet,
      color: summary.budgetUtilizationPercentage > 100 ? 'text-amber-500' : 'text-blue-500',
      bgColor: summary.budgetUtilizationPercentage > 100 ? 'bg-amber-500/10' : 'bg-blue-500/10',
      badge: 'Usage',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" data-testid="analytics-kpi-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-xl bg-card border border-border p-4 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg ${card.bgColor} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground tracking-tight">{card.value}</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-xs">
              <span className="text-muted-foreground truncate max-w-[120px]">{card.change}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${card.bgColor} ${card.color}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsCards;
