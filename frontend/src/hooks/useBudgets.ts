import { useState, useCallback, useEffect, useMemo } from 'react';
import budgetService from '@/services/budgetService';
import type { Budget, BudgetRequest, BudgetStatsSummary, BudgetPeriod, BudgetStatus } from '@/types/budget';
import { parseApiError } from '@/services/api';

export type PeriodFilter = BudgetPeriod | 'ALL';
export type StatusFilter = BudgetStatus | 'ALL';

/** Computes budget status based on spent vs. amount. */
export function getBudgetStatus(budget: Budget): BudgetStatus {
  if (budget.amount <= 0) return 'ON_TRACK';
  const pct = (budget.spent / budget.amount) * 100;
  if (pct >= 100) return 'OVER_BUDGET';
  if (pct >= 80) return 'AT_RISK';
  return 'ON_TRACK';
}

/** Returns percentage spent clamped to 0–100. */
export function getBudgetPercent(budget: Budget): number {
  if (budget.amount <= 0) return 0;
  return Math.min(100, Math.round((budget.spent / budget.amount) * 100));
}

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState<string>('');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await budgetService.getBudgets();
      setBudgets(data);
    } catch (err: unknown) {
      const msg = parseApiError(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // ─── Computed Stats ──────────────────────────────────────────────────────────

  const statsSummary = useMemo<BudgetStatsSummary>(() => {
    const totalBudgets = budgets.length;
    const totalAllocated = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);

    let overBudgetCount = 0;
    let atRiskCount = 0;
    let onTrackCount = 0;

    budgets.forEach((b) => {
      const status = getBudgetStatus(b);
      if (status === 'OVER_BUDGET') overBudgetCount++;
      else if (status === 'AT_RISK') atRiskCount++;
      else onTrackCount++;
    });

    return { totalBudgets, totalAllocated, totalSpent, overBudgetCount, atRiskCount, onTrackCount };
  }, [budgets]);

  // ─── Filtered Budgets ────────────────────────────────────────────────────────

  const filteredBudgets = useMemo<Budget[]>(() => {
    return budgets.filter((b) => {
      // Search by name
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        if (!b.name.toLowerCase().includes(q)) return false;
      }

      // Period filter
      if (periodFilter !== 'ALL' && b.period !== periodFilter) return false;

      // Status filter
      if (statusFilter !== 'ALL') {
        const status = getBudgetStatus(b);
        if (status !== statusFilter) return false;
      }

      return true;
    });
  }, [budgets, search, periodFilter, statusFilter]);

  // ─── CRUD Actions ────────────────────────────────────────────────────────────

  const createBudget = useCallback(
    async (payload: BudgetRequest): Promise<Budget> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const created = await budgetService.createBudget(payload);
        await fetchBudgets();
        return created;
      } catch (err: unknown) {
        const msg = parseApiError(err);
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchBudgets]
  );

  const updateBudget = useCallback(
    async (id: string, payload: BudgetRequest): Promise<Budget> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const updated = await budgetService.updateBudget(id, payload);
        await fetchBudgets();
        return updated;
      } catch (err: unknown) {
        const msg = parseApiError(err);
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchBudgets]
  );

  const deleteBudget = useCallback(
    async (id: string): Promise<void> => {
      setIsDeleting(true);
      setError(null);
      try {
        await budgetService.deleteBudget(id);
        await fetchBudgets();
      } catch (err: unknown) {
        const msg = parseApiError(err);
        setError(msg);
        throw err;
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchBudgets]
  );

  const resetFilters = useCallback(() => {
    setSearch('');
    setPeriodFilter('ALL');
    setStatusFilter('ALL');
  }, []);

  return {
    budgets,
    filteredBudgets,
    statsSummary,
    isLoading,
    isSubmitting,
    isDeleting,
    error,

    // Filter state
    search,
    periodFilter,
    statusFilter,

    // Filter setters
    setSearch,
    setPeriodFilter,
    setStatusFilter,
    resetFilters,

    // Actions
    refetch: fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  };
};

export default useBudgets;
