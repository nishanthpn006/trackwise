import React from 'react';
import type { ReportSummary } from '@/types/report';
import { Calendar, TrendingUp, TrendingDown, PiggyBank, Wallet, Target, Tag } from 'lucide-react';

interface MonthlyReportTabProps {
  summary: ReportSummary | null;
  isLoading?: boolean;
}

export const MonthlyReportTab: React.FC<MonthlyReportTabProps> = ({ summary, isLoading }) => {
  const formatCurrency = (val: number | undefined) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-card border border-border rounded-xl" />
        <div className="h-64 bg-card border border-border rounded-xl" />
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Monthly Executive Summary</h3>
            <p className="text-xs text-muted-foreground">Comprehensive financial statement for the selected period</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-muted rounded-full text-foreground">
          {summary.transactionsCount} Transactions Logged
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-semibold text-xs">
            <TrendingUp className="w-4 h-4" />
            <span>INCOME SUMMARY</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{formatCurrency(summary.totalIncome)}</div>
          <p className="text-xs text-muted-foreground">
            Peak Income: <span className="font-semibold text-foreground">{summary.insights?.largestIncomeTitle || 'N/A'}</span> ({formatCurrency(summary.largestIncome)})
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs">
            <TrendingDown className="w-4 h-4" />
            <span>EXPENSE SUMMARY</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{formatCurrency(summary.totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">
            Peak Expense: <span className="font-semibold text-foreground">{summary.insights?.largestExpenseTitle || 'N/A'}</span> ({formatCurrency(summary.largestExpense)})
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-indigo-500 font-semibold text-xs">
            <PiggyBank className="w-4 h-4" />
            <span>SAVINGS RATE</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{summary.savingsRatePercentage.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Net Savings: <span className="font-semibold text-indigo-600">{formatCurrency(summary.netSavings)}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Wallet className="w-4 h-4 text-primary" />
            <span>Budget Performance</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Budget Allocated:</span>
              <span className="font-semibold">{formatCurrency(summary.budgetAnalytics.totalAllocated)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Budget Spent:</span>
              <span className="font-semibold">{formatCurrency(summary.budgetAnalytics.totalSpent)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Remaining Budget:</span>
              <span className="font-semibold text-emerald-600">{formatCurrency(summary.budgetAnalytics.remainingBudget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status Message:</span>
              <span className="font-semibold text-primary">{summary.insights?.budgetStatusMessage}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Target className="w-4 h-4 text-indigo-500" />
            <span>Savings Goals Performance</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Target Amount:</span>
              <span className="font-semibold">{formatCurrency(summary.goalAnalytics.totalTargetAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Saved to Date:</span>
              <span className="font-semibold text-indigo-600">{formatCurrency(summary.goalAnalytics.totalSaved)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Overall Goal Progress:</span>
              <span className="font-semibold text-emerald-600">{summary.goalAnalytics.overallProgressPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trajectory Message:</span>
              <span className="font-semibold text-indigo-600">{summary.insights?.goalProgressMessage}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm mb-2">
          <Tag className="w-4 h-4 text-primary" />
          <span>Top Expenses Breakdown</span>
        </div>
        <div className="divide-y divide-border">
          {summary.topCategories.map((c, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs">
              <div className="font-medium text-foreground">{c.categoryName}</div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">{c.transactionCount} transactions</span>
                <span className="font-bold text-foreground">{formatCurrency(c.amount)}</span>
                <span className="font-semibold text-primary w-12 text-right">{c.percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyReportTab;
