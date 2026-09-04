import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import PageContainer from '@/components/common/PageContainer';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardPeriodSelector from '@/components/dashboard/DashboardPeriodSelector';
import SummaryCard from '@/components/dashboard/SummaryCard';
import DashboardSummarySkeleton from '@/components/dashboard/DashboardSummarySkeleton';
import DashboardErrorCard from '@/components/dashboard/DashboardErrorCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentTransactionsCard from '@/components/dashboard/RecentTransactionsCard';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import BudgetStatusWidget from '@/components/dashboard/BudgetStatusWidget';
import AccountsSummaryWidget from '@/components/dashboard/AccountsSummaryWidget';
import UpcomingPaymentsWidget from '@/components/dashboard/UpcomingPaymentsWidget';
import SavingsGoalsWidget from '@/components/dashboard/SavingsGoalsWidget';
import RecentNotificationsWidget from '@/components/dashboard/RecentNotificationsWidget';

import GoalContributionDialog from '@/components/goals/GoalContributionDialog';
import goalService from '@/services/goalService';
import type { SavingsGoal, GoalContributionRequest } from '@/types/goal';
import type { DashboardPeriod } from '@/types/dashboard';
import { useToast } from '@/hooks/useToast';
import { formatCurrency } from '@/utils/currency';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Scale,
  Tag,
  Percent,
  Hash,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';

/**
 * DashboardPage — Main application dashboard.
 * Features real-data aggregated metrics, period filtering, clear financial hierarchy,
 * analytics chart grid, live accounts & budget widgets, quick actions, and recent transactions.
 */
export const DashboardPage: React.FC = () => {
  const [period, setPeriod] = useState<DashboardPeriod>('THIS_MONTH');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');

  const {
    summary,
    isLoading,
    errorMessage,
    hasAccounts,
    hasTransactions,
    refetch,
  } = useDashboardSummary(period, customStart, customEnd);

  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [contribGoal, setContribGoal] = useState<SavingsGoal | null>(null);
  const [isContribOpen, setIsContribOpen] = useState<boolean>(false);
  const [isSubmittingContrib, setIsSubmittingContrib] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handlePeriodChange = (newPeriod: DashboardPeriod) => {
    setPeriod(newPeriod);
  };

  const handleCustomDateChange = (start: string, end: string) => {
    setCustomStart(start);
    setCustomEnd(end);
    setPeriod('CUSTOM');
  };

  const periodLabel = useMemo(() => {
    switch (period) {
      case 'THIS_MONTH':
        return 'This Month';
      case 'LAST_MONTH':
        return 'Last Month';
      case 'ALL_TIME':
        return 'All Time';
      case 'CUSTOM':
        return customStart && customEnd ? `${customStart} to ${customEnd}` : 'Custom Range';
    }
  }, [period, customStart, customEnd]);

  const handleQuickActionRefresh = useCallback(() => {
    refetch();
    setRefreshKey((prev) => prev + 1);
  }, [refetch]);

  const handleOpenContrib = (goal: SavingsGoal) => {
    setContribGoal(goal);
    setIsContribOpen(true);
  };

  const handleAddContribution = async (goalId: string, data: GoalContributionRequest) => {
    setIsSubmittingContrib(true);
    try {
      await goalService.addContribution(goalId, data);
      toast.success(`Successfully added ${formatCurrency(data.amount)} to goal.`);
      handleQuickActionRefresh();
    } catch {
      toast.error('Failed to add savings deposit. Please try again.');
    } finally {
      setIsSubmittingContrib(false);
    }
  };

  const accountCount = summary?.accounts?.length ?? 0;

  return (
    <PageContainer className="py-6 space-y-6">
      {/* Top Header & Period Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <DashboardHeader />
        <DashboardPeriodSelector
          period={period}
          onPeriodChange={handlePeriodChange}
          startDate={customStart}
          endDate={customEnd}
          onCustomDateChange={handleCustomDateChange}
        />
      </div>

      {/* Inline Error Banner */}
      {errorMessage && (
        <DashboardErrorCard message={errorMessage} onRetry={refetch} />
      )}

      {/* Contextual Onboarding Banners if new user */}
      {!isLoading && !hasAccounts && (
        <div className="p-5 bg-card border border-primary/30 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-primary/5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Welcome to TrackWise! Setup your accounts</h3>
            <p className="text-xs text-muted-foreground">
              Add your primary bank, cash, or digital wallet accounts to track real-time balances and net cash flow.
            </p>
          </div>
          <Link
            to="/accounts"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0 shadow-2xs"
          >
            <span>Create Account</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {!isLoading && hasAccounts && !hasTransactions && (
        <div className="p-4 bg-card border border-border/60 rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/20">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-foreground">Accounts ready — Add your first transaction</h3>
            <p className="text-[11px] text-muted-foreground">
              Record an income deposit or expense purchase to generate period cash flow, savings rate, and category breakdowns.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0 shadow-2xs"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Transaction</span>
          </button>
        </div>
      )}

      {/* Summary Cards Section with Financial Hierarchy */}
      {isLoading ? (
        <DashboardSummarySkeleton />
      ) : (
        <div className="space-y-4">
          {/* Primary Financial Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Primary Anchor: Total Balance */}
            <SummaryCard
              title="Total Balance"
              value={summary?.totalBalance ?? 0}
              icon={<Wallet className="h-5 w-5" />}
              variant="balance"
              subtitle={accountCount > 0 ? `Across ${accountCount} active ${accountCount === 1 ? 'account' : 'accounts'}` : 'Current net accounts balance'}
              isCurrency
            />

            {/* 2. Total Income for Period */}
            <SummaryCard
              title={`Income (${periodLabel})`}
              value={summary?.totalIncome ?? 0}
              icon={<TrendingUp className="h-5 w-5" />}
              variant="income"
              subtitle="Incoming cash flow"
              isCurrency
            />

            {/* 3. Total Expense for Period */}
            <SummaryCard
              title={`Expenses (${periodLabel})`}
              value={summary?.totalExpense ?? 0}
              icon={<TrendingDown className="h-5 w-5" />}
              variant="expense"
              subtitle="Outgoing expenditures"
              isCurrency
            />

            {/* 4. Net Cash Flow for Period */}
            <SummaryCard
              title={`Net Cash Flow (${periodLabel})`}
              value={summary?.netCashFlow ?? 0}
              icon={<Scale className="h-5 w-5" />}
              variant="cashflow"
              subtitle={(summary?.netCashFlow ?? 0) >= 0 ? 'Net surplus for period' : 'Net deficit for period'}
              isCurrency
            />
          </div>

          {/* Secondary Contextual Indicators Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-card border border-border/50 rounded-xl shadow-2xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Percent className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Savings Rate</p>
                  <p className="text-xs font-semibold text-foreground truncate">
                    {summary?.savingsRate !== undefined ? `${summary.savingsRate.toFixed(1)}%` : '0.0%'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground hidden sm:block shrink-0">of period income</span>
            </div>

            <div className="p-3 bg-card border border-border/50 rounded-xl shadow-2xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <Tag className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Top Category</p>
                  <p className="text-xs font-semibold text-foreground truncate">
                    {summary?.topCategory || 'No expenses'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground hidden sm:block shrink-0">highest spend</span>
            </div>

            <div className="p-3 bg-card border border-border/50 rounded-xl shadow-2xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0">
                  <Hash className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Activity</p>
                  <p className="text-xs font-semibold text-foreground truncate">
                    {summary?.transactionCount ?? summary?.transactionsThisMonth ?? 0} transactions
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground hidden sm:block shrink-0">{periodLabel}</span>
            </div>
          </div>
        </div>
      )}

      {/* Middle Section: Quick Actions & Live Budget / Goals & Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Quick Actions, Live Accounts, Budget Status, Savings Goals, Notifications */}
        <div className="lg:col-span-1 space-y-6">
          <QuickActions onRefresh={handleQuickActionRefresh} />
          <AccountsSummaryWidget refreshKey={refreshKey} />
          <UpcomingPaymentsWidget refreshKey={refreshKey} />
          <BudgetStatusWidget refreshKey={refreshKey} />
          <SavingsGoalsWidget onOpenContribution={handleOpenContrib} refreshKey={refreshKey} />
          <RecentNotificationsWidget />
        </div>

        {/* Right Column: Analytics Charts (passes real period-scoped category breakdown) */}
        <div className="lg:col-span-2">
          <DashboardCharts
            refreshKey={refreshKey}
            categoryBreakdown={summary?.categoryBreakdown}
            periodLabel={periodLabel}
          />
        </div>
      </div>

      {/* Recent Transactions Card (Real Latest Transactions with Category & Account) */}
      <RecentTransactionsCard
        transactions={summary?.recentTransactions ?? []}
        isLoading={isLoading}
      />

      {/* Quick Deposit Dialog */}
      {isContribOpen && (
        <GoalContributionDialog
          isOpen={isContribOpen}
          onClose={() => setIsContribOpen(false)}
          onSubmit={handleAddContribution}
          goal={contribGoal}
          isSubmitting={isSubmittingContrib}
        />
      )}
    </PageContainer>
  );
};

export default DashboardPage;
