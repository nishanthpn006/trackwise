import { useState, useCallback, useEffect, useMemo } from 'react';
import categoryService from '@/services/categoryService';
import transactionService from '@/services/transactionService';
import type {
  Category,
  CategoryRequest,
  CategoryWithStats,
  CategoryStatsSummary,
} from '@/types/category';
import type { Transaction, TransactionType } from '@/types/transaction';
import type { UsageFilter, SortOption } from '@/components/categories/CategoryFilters';
import { parseApiError } from '@/services/api';

export const useCategories = (typeParam?: TransactionType) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting state
  const [search, setSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'ALL'>(typeParam || 'ALL');
  const [usageFilter, setUsageFilter] = useState<UsageFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('ALPHABETICAL');

  const fetchCategoriesAndStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [catData, txData] = await Promise.all([
        categoryService.getCategories(),
        transactionService.getTransactions({ size: 1000 }).catch(() => null),
      ]);

      setCategories(catData);
      setAllTransactions(txData?.content || []);
    } catch (err: unknown) {
      const msg = parseApiError(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesAndStats();
  }, [fetchCategoriesAndStats]);

  // Compute stats per category based on transactions
  const categoriesWithStats = useMemo<CategoryWithStats[]>(() => {
    const currentMonthKey = new Date().toISOString().substring(0, 7); // YYYY-MM

    return categories.map((cat) => {
      const matchingTxs = allTransactions.filter((tx) => tx.category?.id === cat.id);
      const transactionCount = matchingTxs.length;
      const totalAmount = matchingTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0);

      const sortedDates = matchingTxs
        .map((tx) => tx.date)
        .filter(Boolean)
        .sort((a, b) => b.localeCompare(a));

      const lastUsedDate = sortedDates.length > 0 ? sortedDates[0] : null;
      const usedThisMonth = matchingTxs.some((tx) => tx.date && tx.date.startsWith(currentMonthKey));

      return {
        ...cat,
        transactionCount,
        totalAmount,
        lastUsedDate,
        usedThisMonth,
      };
    });
  }, [categories, allTransactions]);

  // Compute Overall Category Statistics Summary
  const statsSummary = useMemo<CategoryStatsSummary>(() => {
    const totalCategories = categoriesWithStats.length;
    const incomeCategories = categoriesWithStats.filter((c) => c.type === 'INCOME').length;
    const expenseCategories = categoriesWithStats.filter((c) => c.type === 'EXPENSE').length;
    const unusedCategories = categoriesWithStats.filter((c) => c.transactionCount === 0).length;
    const categoriesUsedThisMonth = categoriesWithStats.filter((c) => c.usedThisMonth).length;

    let mostUsedCategory: { name: string; count: number } | null = null;
    let maxCount = 0;

    categoriesWithStats.forEach((c) => {
      if (c.transactionCount > maxCount) {
        maxCount = c.transactionCount;
        mostUsedCategory = { name: c.name, count: c.transactionCount };
      }
    });

    return {
      totalCategories,
      incomeCategories,
      expenseCategories,
      mostUsedCategory,
      unusedCategories,
      categoriesUsedThisMonth,
    };
  }, [categoriesWithStats]);

  // Filter and Sort Categories
  const filteredCategories = useMemo<CategoryWithStats[]>(() => {
    return categoriesWithStats
      .filter((cat) => {
        // Search filter (Name or Description)
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matchName = cat.name.toLowerCase().includes(q);
          const matchDesc = cat.description ? cat.description.toLowerCase().includes(q) : false;
          if (!matchName && !matchDesc) return false;
        }

        // Type filter
        if (typeFilter !== 'ALL' && cat.type !== typeFilter) {
          return false;
        }

        // Usage filter
        if (usageFilter === 'USED' && cat.transactionCount === 0) {
          return false;
        }
        if (usageFilter === 'UNUSED' && cat.transactionCount > 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'ALPHABETICAL') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'MOST_USED') {
          return b.transactionCount - a.transactionCount;
        }
        if (sortBy === 'NEWEST') {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === 'OLDEST') {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        }
        return 0;
      });
  }, [categoriesWithStats, search, typeFilter, usageFilter, sortBy]);

  // CRUD Actions
  const createCategory = useCallback(
    async (payload: CategoryRequest): Promise<Category> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const newCat = await categoryService.createCategory(payload);
        await fetchCategoriesAndStats();
        return newCat;
      } catch (err: unknown) {
        const msg = parseApiError(err);
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchCategoriesAndStats]
  );

  const updateCategory = useCallback(
    async (id: string, payload: CategoryRequest): Promise<Category> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const updatedCat = await categoryService.updateCategory(id, payload);
        await fetchCategoriesAndStats();
        return updatedCat;
      } catch (err: unknown) {
        const msg = parseApiError(err);
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchCategoriesAndStats]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<void> => {
      setIsDeleting(true);
      setError(null);
      try {
        await categoryService.deleteCategory(id);
        await fetchCategoriesAndStats();
      } catch (err: unknown) {
        const msg = parseApiError(err);
        setError(msg);
        throw err;
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchCategoriesAndStats]
  );

  const resetFilters = useCallback(() => {
    setSearch('');
    setTypeFilter('ALL');
    setUsageFilter('ALL');
    setSortBy('ALPHABETICAL');
  }, []);

  return {
    categories,
    categoriesWithStats,
    filteredCategories,
    statsSummary,
    isLoading,
    isSubmitting,
    isDeleting,
    error,

    // Filter states
    search,
    typeFilter,
    usageFilter,
    sortBy,

    // Filter set state callbacks
    setSearch,
    setTypeFilter,
    setUsageFilter,
    setSortBy,
    resetFilters,

    // Actions
    refetch: fetchCategoriesAndStats,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategories;
