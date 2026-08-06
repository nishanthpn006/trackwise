import { useState, useCallback, useEffect, useMemo } from 'react';
import goalService from '@/services/goalService';
import type {
  SavingsGoal,
  SavingsGoalRequest,
  GoalContributionRequest,
  GoalSummary,
  GoalStatus,
  GoalSortOption,
} from '@/types/goal';
import { parseApiError } from '@/services/api';
import { useDebounce } from './useDebounce';
import { useToast } from './useToast';

export function getCalculatedGoalStatus(goal: SavingsGoal): GoalStatus {
  if (goal.currentAmount >= goal.targetAmount) {
    return 'COMPLETED';
  }
  const today = new Date().toISOString().split('T')[0];
  if (goal.targetDate && goal.targetDate < today) {
    return 'OVERDUE';
  }
  if (goal.currentAmount === 0) {
    return 'NOT_STARTED';
  }
  if (goal.currentAmount >= goal.targetAmount * 0.85) {
    return 'ALMOST_COMPLETE';
  }
  return 'IN_PROGRESS';
}

export const useGoals = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [summary, setSummary] = useState<GoalSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState<GoalStatus | 'ALL'>('ALL');
  const [sortOption, setSortOption] = useState<GoalSortOption>('TARGET_DATE');

  const toast = useToast();

  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [goalsData, summaryData] = await Promise.all([
        goalService.getGoals(),
        goalService.getGoalSummary(),
      ]);
      setGoals(goalsData);
      setSummary(summaryData);
    } catch (err: unknown) {
      const msg = parseApiError(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // ─── Filtered & Sorted Goals ──────────────────────────────────────────────────

  const filteredGoals = useMemo<SavingsGoal[]>(() => {
    let result = [...goals];

    // Search filter (name and description)
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          (g.description && g.description.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((g) => {
        const computedStatus = g.status || getCalculatedGoalStatus(g);
        return computedStatus === statusFilter;
      });
    }

    // Sort options
    result.sort((a, b) => {
      if (sortOption === 'NEWEST') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortOption === 'OLDEST') {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      if (sortOption === 'HIGHEST_PROGRESS') {
        const pctA = a.targetAmount > 0 ? (a.currentAmount / a.targetAmount) * 100 : 0;
        const pctB = b.targetAmount > 0 ? (b.currentAmount / b.targetAmount) * 100 : 0;
        return pctB - pctA;
      }
      if (sortOption === 'LOWEST_PROGRESS') {
        const pctA = a.targetAmount > 0 ? (a.currentAmount / a.targetAmount) * 100 : 0;
        const pctB = b.targetAmount > 0 ? (b.currentAmount / b.targetAmount) * 100 : 0;
        return pctA - pctB;
      }
      if (sortOption === 'TARGET_DATE') {
        return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
      }
      return 0;
    });

    return result;
  }, [goals, debouncedSearch, statusFilter, sortOption]);

  // ─── Actions ─────────────────────────────────────────────────────────────────

  const createGoal = useCallback(
    async (payload: SavingsGoalRequest): Promise<SavingsGoal> => {
      setIsSubmitting(true);
      try {
        const created = await goalService.createGoal(payload);
        toast.success(`Savings goal "${created.name}" created successfully.`);
        await fetchGoals();
        return created;
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchGoals, toast]
  );

  const updateGoal = useCallback(
    async (id: string, payload: SavingsGoalRequest): Promise<SavingsGoal> => {
      setIsSubmitting(true);
      try {
        const updated = await goalService.updateGoal(id, payload);
        toast.success(`Savings goal "${updated.name}" updated successfully.`);
        await fetchGoals();
        return updated;
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchGoals, toast]
  );

  const deleteGoal = useCallback(
    async (id: string): Promise<void> => {
      setIsDeleting(true);
      try {
        await goalService.deleteGoal(id);
        toast.success('The savings goal has been deleted successfully.');
        await fetchGoals();
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(msg);
        throw err;
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchGoals, toast]
  );

  const addContribution = useCallback(
    async (id: string, payload: GoalContributionRequest): Promise<SavingsGoal> => {
      setIsSubmitting(true);
      try {
        const updated = await goalService.addContribution(id, payload);
        toast.success(`Added $${payload.amount.toLocaleString()} toward "${updated.name}".`);
        await fetchGoals();
        return updated;
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchGoals, toast]
  );

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setSortOption('TARGET_DATE');
  }, []);

  return {
    goals,
    filteredGoals,
    summary,
    isLoading,
    isSubmitting,
    isDeleting,
    error,

    // Filter states & setters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    resetFilters,

    // Actions
    refetch: fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
  };
};

export default useGoals;
