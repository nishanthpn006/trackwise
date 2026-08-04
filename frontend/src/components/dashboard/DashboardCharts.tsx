import React, { useEffect, useState, useCallback } from 'react';
import dashboardService from '@/services/dashboardService';
import type { DashboardAnalytics } from '@/types/dashboard';
import AnalyticsSkeleton from './AnalyticsSkeleton';
import IncomeExpenseChart from './IncomeExpenseChart';
import CategoryPieChart from './CategoryPieChart';
import SpendingTrendChart from './SpendingTrendChart';
import FinancialInsightsCard from './FinancialInsightsCard';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface DashboardChartsProps {
  refreshKey?: number;
}

/**
 * DashboardCharts — Orchestrator component for all analytics widgets.
 *
 * Manages its own data-fetch lifecycle independently from the summary fetch in DashboardPage,
 * so a failure here doesn't block the summary cards from rendering.
 */
export const DashboardCharts: React.FC<DashboardChartsProps> = ({ refreshKey }) => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await dashboardService.getAnalytics();
      setAnalytics(data);
    } catch {
      setErrorMessage('Failed to load analytics data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics, refreshKey]);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (errorMessage) {
    return (
      <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
        <button
          type="button"
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-[11px] font-semibold hover:bg-destructive/90 transition-colors shrink-0"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <IncomeExpenseChart data={analytics.monthlyData} />
      <CategoryPieChart data={analytics.categoryBreakdown} />
      <SpendingTrendChart data={analytics.spendingTrend} />
      <FinancialInsightsCard insights={analytics.financialInsights} />
    </div>
  );
};

export default DashboardCharts;
