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
 * Features 8 production-ready summary cards, analytics chart grid, quick actions dialogs, and recent transactions.
 */
export const DashboardPage: React.FC = () => {
  const { summary, isLoading, errorMessage, isEmpty, refetch } = useDashboardSummary();
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleQuickActionRefresh = useCallback(() => {
    refetch();
    setRefreshKey((prev) => prev + 1);
  }, [refetch]);

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

      {/* Middle Section: Quick Actions & Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Quick Actions (1 col on desktop) */}
        <div className="lg:col-span-1">
          <QuickActions onRefresh={handleQuickActionRefresh} />
        </div>

        {/* Analytics Charts (2 cols on desktop, full-width on mobile) */}
        <div className="lg:col-span-2">
          <DashboardCharts refreshKey={refreshKey} />
        </div>
      </div>

      {/* Recent Transactions Card */}
      <RecentTransactionsCard
        transactions={summary?.recentTransactions ?? []}
        isLoading={isLoading}
      />
    </PageContainer>
  );
};

export default DashboardPage;
