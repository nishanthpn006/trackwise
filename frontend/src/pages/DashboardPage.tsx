import React, { useState, useCallback } from 'react';
import PageContainer from '@/components/common/PageContainer';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SummaryCard from '@/components/dashboard/SummaryCard';
import DashboardSummarySkeleton from '@/components/dashboard/DashboardSummarySkeleton';
import DashboardErrorCard from '@/components/dashboard/DashboardErrorCard';
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentTransactionsCard from '@/components/dashboard/RecentTransactionsCard';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import SavingsGoalsWidget from '@/components/dashboard/SavingsGoalsWidget';
import RecentNotificationsWidget from '@/components/dashboard/RecentNotificationsWidget';
import GoalContributionDialog from '@/components/goals/GoalContributionDialog';
import goalService from '@/services/goalService';
import type { SavingsGoal, GoalContributionRequest } from '@/types/goal';
import { useToast } from '@/hooks/useToast';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Tag,
  Percent,
  Calendar,
  Hash,
} from 'lucide-react';

/**
 * DashboardPage — Main application dashboard.
 * Features summary cards, analytics chart grid, savings goals widget, quick actions, and recent transactions.
 */
export const DashboardPage: React.FC = () => {
  const { summary, isLoading, errorMessage, isEmpty, refetch } = useDashboardSummary();
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [contribGoal, setContribGoal] = useState<SavingsGoal | null>(null);
  const [isContribOpen, setIsContribOpen] = useState<boolean>(false);
  const [isSubmittingContrib, setIsSubmittingContrib] = useState<boolean>(false);
  const toast = useToast();

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
      toast.success(`Successfully added $${data.amount.toLocaleString()} to goal.`);
      handleQuickActionRefresh();
    } catch {
      toast.error('Failed to add savings deposit. Please try again.');
    } finally {
      setIsSubmittingContrib(false);
    }
  };

  return (
    <PageContainer className="py-6 space-y-6">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Inline Error Banner */}
      {errorMessage && (
        <DashboardErrorCard message={errorMessage} onRetry={refetch} />
      )}

      {/* Summary Cards Grid Section */}
      {isLoading ? (
        <DashboardSummarySkeleton />
      ) : isEmpty ? (
        <DashboardEmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Balance"
            value={summary?.totalBalance ?? 0}
            icon={<Wallet className="h-5 w-5" />}
            variant="balance"
            subtitle="Net accumulated balance"
            isCurrency
          />
          <SummaryCard
            title="Total Income"
            value={summary?.totalIncome ?? 0}
            icon={<TrendingUp className="h-5 w-5" />}
            variant="income"
            subtitle="All incoming funds"
            isCurrency
          />
          <SummaryCard
            title="Total Expense"
            value={summary?.totalExpense ?? 0}
            icon={<TrendingDown className="h-5 w-5" />}
            variant="expense"
            subtitle="All outgoing spending"
            isCurrency
          />
          <SummaryCard
            title="Total Savings"
            value={summary?.savings ?? summary?.totalSavings ?? 0}
            icon={<PiggyBank className="h-5 w-5" />}
            variant="savings"
            subtitle="Net savings generated"
            isCurrency
          />
          <SummaryCard
            title="Top Category"
            value={summary?.topCategory ?? 'None'}
            icon={<Tag className="h-5 w-5" />}
            variant="category"
            subtitle="Highest all-time spending"
          />
          <SummaryCard
            title="Monthly Savings %"
            value={summary?.monthlySavingsPercentage ?? 0}
            icon={<Percent className="h-5 w-5" />}
            variant="percentage"
            subtitle="Income saved this month"
            isPercentage
          />
          <SummaryCard
            title="Avg Daily Spend"
            value={summary?.averageDailySpend ?? 0}
            icon={<Calendar className="h-5 w-5" />}
            variant="avgSpend"
            subtitle="30-day daily average"
            isCurrency
          />
          <SummaryCard
            title="This Month"
            value={`${summary?.transactionsThisMonth ?? 0} txs`}
            icon={<Hash className="h-5 w-5" />}
            variant="txCount"
            subtitle="Recorded this month"
          />
        </div>
      )}

      {/* Middle Section: Quick Actions & Savings Goals Widget & Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Quick Actions & Savings Goals Overview */}
        <div className="lg:col-span-1 space-y-6">
          <QuickActions onRefresh={handleQuickActionRefresh} />
          <SavingsGoalsWidget onOpenContribution={handleOpenContrib} refreshKey={refreshKey} />
          <RecentNotificationsWidget />
        </div>

        {/* Right Column: Analytics Charts (2 cols on desktop) */}
        <div className="lg:col-span-2">
          <DashboardCharts refreshKey={refreshKey} />
        </div>
      </div>

      {/* Recent Transactions Card */}
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
