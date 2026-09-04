import { useState, useEffect, useCallback, useMemo } from 'react';
import dashboardService from '@/services/dashboardService';
import type { DashboardPeriod, DashboardSummary } from '@/types/dashboard';

export interface UseDashboardSummaryResult {
  summary: DashboardSummary | null;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  hasAccounts: boolean;
  hasTransactions: boolean;
  hasExpenses: boolean;
  refetch: () => Promise<void>;
}

export const useDashboardSummary = (
  period: DashboardPeriod = 'THIS_MONTH',
  startDate?: string,
  endDate?: string
): UseDashboardSummaryResult => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await dashboardService.getSummary(period, startDate, endDate);
      setSummary(data);
    } catch {
      setErrorMessage('Failed to load dashboard summary metrics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [period, startDate, endDate]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const hasAccounts = useMemo(() => {
    return (summary?.accounts?.length ?? 0) > 0;
  }, [summary]);

  const hasTransactions = useMemo(() => {
    return (summary?.transactionCount ?? 0) > 0 || (summary?.recentTransactions?.length ?? 0) > 0;
  }, [summary]);

  const hasExpenses = useMemo(() => {
    return (summary?.totalExpense ?? 0) > 0;
  }, [summary]);

  // Overall empty check: completely new user (no accounts and no transactions)
  const isEmpty = useMemo(() => {
    if (!summary) return false;
    return !hasAccounts && !hasTransactions;
  }, [summary, hasAccounts, hasTransactions]);

  return {
    summary,
    isLoading,
    errorMessage,
    isEmpty,
    hasAccounts,
    hasTransactions,
    hasExpenses,
    refetch: fetchSummary,
  };
};

export default useDashboardSummary;
