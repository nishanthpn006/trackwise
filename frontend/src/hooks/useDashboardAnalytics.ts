import { useState, useCallback, useEffect } from 'react';
import dashboardService from '@/services/dashboardService';
import type { DashboardAnalytics } from '@/types/dashboard';

export interface UseDashboardAnalyticsResult {
  analytics: DashboardAnalytics | null;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  refetch: () => Promise<void>;
}

/**
 * useDashboardAnalytics — Custom hook for fetching and managing analytics chart data lifecycle.
 */
export const useDashboardAnalytics = (refreshKey?: number): UseDashboardAnalyticsResult => {
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

  const isEmpty =
    !analytics ||
    (analytics.monthlyData.every((d) => d.income === 0 && d.expense === 0) &&
      analytics.categoryBreakdown.length === 0 &&
      analytics.spendingTrend.every((d) => d.amount === 0));

  return {
    analytics,
    isLoading,
    errorMessage,
    isEmpty,
    refetch: fetchAnalytics,
  };
};

export default useDashboardAnalytics;
