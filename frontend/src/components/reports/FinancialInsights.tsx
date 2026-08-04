import React from 'react';
import { Sparkles, ArrowUpRight, ArrowDownRight, Lightbulb, Wallet, Target, Calendar } from 'lucide-react';
import type { ReportFinancialInsights } from '@/types/report';

interface FinancialInsightsProps {
  insights: ReportFinancialInsights | undefined;
  isLoading?: boolean;
}

export const FinancialInsights: React.FC<FinancialInsightsProps> = ({ insights, isLoading }) => {
  const formatCurrency = (val: number | undefined) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  if (isLoading) {
    return (
      <div className="h-64 rounded-xl bg-card border border-border p-5 animate-pulse space-y-3">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-20 bg-muted/40 rounded-lg" />
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-xs flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Financial Insights & Intelligence</h3>
            <p className="text-xs text-muted-foreground">Automated pattern analysis & anomaly detection</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 bg-card border border-border rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Highest Expense Category</span>
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-sm font-bold text-foreground truncate">
            {insights.highestCategoryName || 'N/A'}
          </div>
          <div className="text-xs text-rose-500 font-semibold">
            {formatCurrency(insights.highestCategoryAmount)}
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Peak Expense Transaction</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-sm font-bold text-foreground truncate">
            {insights.largestExpenseTitle || 'N/A'}
          </div>
          <div className="text-xs text-rose-500 font-semibold">
            {formatCurrency(insights.largestExpenseAmount)}
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Peak Income Transaction</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-sm font-bold text-foreground truncate">
            {insights.largestIncomeTitle || 'N/A'}
          </div>
          <div className="text-xs text-emerald-500 font-semibold">
            {formatCurrency(insights.largestIncomeAmount)}
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Avg Monthly Savings</span>
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-sm font-bold text-foreground truncate">
            {formatCurrency(insights.averageMonthlySavings)}
          </div>
          <div className="text-xs text-indigo-500 font-semibold">Net Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div className="p-3 bg-muted/20 border border-border/60 rounded-xl flex items-start gap-3">
          <Wallet className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-foreground block mb-0.5">Budget Health Insight</span>
            <span className="text-muted-foreground">{insights.budgetStatusMessage}</span>
          </div>
        </div>

        <div className="p-3 bg-muted/20 border border-border/60 rounded-xl flex items-start gap-3">
          <Target className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-foreground block mb-0.5">Goals Trajectory</span>
            <span className="text-muted-foreground">{insights.goalProgressMessage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialInsights;
