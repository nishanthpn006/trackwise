import { useState, useEffect, useCallback, useMemo } from 'react';
import dashboardService from '@/services/dashboardService';
import type { DashboardSummary } from '@/types/dashboard';

export interface UseDashboardSummaryResult {
  summary: DashboardSummary | null;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  refetch: () => Promise<void>;
}

export const useDashboardSummary = (): UseDashboardSummaryResult => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
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
    fetchSummary();
  }, [fetchSummary]);

  // Derived empty state check: true if user has zero income, zero expense, and no recent transactions
  const isEmpty = useMemo(() => {
    if (!summary) return false;
    return (
      summary.totalIncome === 0 &&
      summary.totalExpense === 0 &&
      (!summary.recentTransactions || summary.recentTransactions.length === 0)
    );
  }, [summary]);

  return {
    summary,
    isLoading,
    errorMessage,
    isEmpty,
    refetch: fetchSummary,
  };
};

export default useDashboardSummary;
