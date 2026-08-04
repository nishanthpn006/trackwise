import React from 'react';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import AnalyticsSkeleton from './AnalyticsSkeleton';
import IncomeExpenseChart from './IncomeExpenseChart';
import CategoryPieChart from './CategoryPieChart';
import SpendingTrendChart from './SpendingTrendChart';
import FinancialInsightsCard from './FinancialInsightsCard';
import { AlertCircle, RefreshCw, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router';

export interface DashboardChartsProps {
  refreshKey?: number;
}

/**
 * DashboardCharts — Orchestrator component for all 4 analytics widgets (Pie, Bar, Line, Insights).
 * Uses React.memo and custom hook useDashboardAnalytics for optimal performance and zero unnecessary re-renders.
 */
export const DashboardCharts: React.FC<DashboardChartsProps> = ({ refreshKey }) => {
  const { analytics, isLoading, errorMessage, isEmpty, refetch } = useDashboardAnalytics(refreshKey);
  const navigate = useNavigate();

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
          onClick={refetch}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-[11px] font-semibold hover:bg-destructive/90 transition-colors shrink-0"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (isEmpty || !analytics) {
    return (
      <div className="bg-card border border-dashed border-border/80 rounded-2xl p-8 text-center space-y-3 bg-muted/20 flex flex-col items-center justify-center">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <BarChart3 className="h-8 w-8" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-sm font-bold text-foreground">No analytics available yet</h3>
          <p className="text-xs text-muted-foreground">
            Log your income and expense transactions to view category breakdowns and spending trends.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Add Transactions
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <IncomeExpenseChart data={analytics.monthlyData} />
      <CategoryPieChart data={analytics.categoryBreakdown} />
      <SpendingTrendChart data={analytics.spendingTrend} />
      <FinancialInsightsCard insights={analytics.financialInsights} />
    </div>
  );
};

export default React.memo(DashboardCharts);
