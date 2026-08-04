import React, { useEffect, useState, useCallback } from 'react';
import PageContainer from '@/components/common/PageContainer';
import dashboardService from '@/services/dashboardService';
import type { DashboardSummary } from '@/types/dashboard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SummaryCard from '@/components/dashboard/SummaryCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentTransactionsCard from '@/components/dashboard/RecentTransactionsCard';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDashboardSummary = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch {
      setErrorMessage('Failed to load dashboard summary metrics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  if (isLoading) {
    return (
      <PageContainer className="py-6">
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-6 space-y-6">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Error Alert with Retry */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={fetchDashboardSummary}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-[11px] font-semibold hover:bg-destructive/90 transition-colors shrink-0"
          >
            <RefreshCw className="h-3 w-3 animate-spin-hover" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Summary Cards Grid: Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Balance"
          amount={summary?.totalBalance ?? 0}
          icon={<Wallet className="h-5 w-5 text-primary" />}
          variant="balance"
          subtitle="Net accumulated balance"
        />
        <SummaryCard
          title="Total Income"
          amount={summary?.totalIncome ?? 0}
          icon={<TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
          variant="income"
          subtitle="All incoming funds"
        />
        <SummaryCard
          title="Total Expense"
          amount={summary?.totalExpense ?? 0}
          icon={<TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
          variant="expense"
          subtitle="All outgoing spending"
        />
        <SummaryCard
          title="Savings"
          amount={summary?.savings ?? 0}
          icon={<PiggyBank className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          variant="savings"
          subtitle="Net savings generated"
        />
      </div>

      {/* Middle Section: Quick Actions & Charts Placeholder Grid */}
      {/* Desktop & Tablet responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Quick Actions (1 col on desktop) */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        {/* Charts Section Placeholder (2 cols on desktop) */}
        <div className="lg:col-span-2 bg-card border border-border/60 rounded-xl shadow-xs p-6 flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground tracking-tight">Analytics & Overview</h2>
              <p className="text-[11px] text-muted-foreground">Income vs Expense trends</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/60 text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>

          {/* TODO: Charts section placeholder reserved for future chart & analytics integration */}
          <div className="border border-dashed border-border/80 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-muted/20">
            <BarChart3 className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-xs font-semibold text-muted-foreground">Financial Charts Section</p>
            <p className="text-[11px] text-muted-foreground/80 max-w-xs mt-1">
              Visual breakdown and interactive charts will be integrated in upcoming analytics releases.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions Card */}
      <RecentTransactionsCard
        transactions={summary?.recentTransactions ?? []}
        isLoading={false}
      />
    </PageContainer>
  );
};

export default DashboardPage;
