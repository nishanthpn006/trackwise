import { useState, useCallback, useEffect } from 'react';
import transactionService from '@/services/transactionService';
import type {
  DashboardSummary,
  PagedResponse,
  Transaction,
  TransactionQueryParams,
  TransactionRequest,
  TransactionType,
} from '@/types/transaction';
import { parseApiError } from '@/services/api';

export interface UseTransactionsParams {
  initialSize?: number;
  autoFetch?: boolean;
}

export const useTransactions = (options: UseTransactionsParams = {}) => {
  const { initialSize = 10, autoFetch = true } = options;

  const [transactions, setTransactions] = useState<PagedResponse<Transaction> | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(autoFetch);
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(autoFetch);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter and pagination state
  const [search, setSearch] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [type, setType] = useState<TransactionType | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(initialSize);
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams: TransactionQueryParams = {
        search: search.trim() || undefined,
        categoryId: categoryId || undefined,
        type: type || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        size,
        sortBy,
        sortDir,
      };

      const data = await transactionService.getTransactions(queryParams);
      setTransactions(data);
    } catch (err: unknown) {
      const msg = parseApiError(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [search, categoryId, type, startDate, endDate, page, size, sortBy, sortDir]);

  const fetchSummary = useCallback(async () => {
    setIsSummaryLoading(true);
    try {
      const data = await transactionService.getDashboardSummary();
      setSummary(data);
    } catch {
      // Summary error can fall back silently or be ignored if main fetch succeeded
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchTransactions(), fetchSummary()]);
  }, [fetchTransactions, fetchSummary]);

  useEffect(() => {
    if (autoFetch) {
      fetchTransactions();
    }
  }, [autoFetch, fetchTransactions]);

  useEffect(() => {
    if (autoFetch) {
      fetchSummary();
    }
  }, [autoFetch, fetchSummary]);

  const createTransaction = useCallback(
    async (payload: TransactionRequest): Promise<Transaction> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const tx = await transactionService.createTransaction(payload);
        await refreshAll();
        return tx;
      } catch (err: unknown) {
        const msg = parseApiError(err);
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshAll]
  );

  const updateTransaction = useCallback(
    async (id: string, payload: TransactionRequest): Promise<Transaction> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const tx = await transactionService.updateTransaction(id, payload);
        await refreshAll();
        return tx;
      } catch (err: unknown) {
        const msg = parseApiError(err);
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [refreshAll]
  );

  const deleteTransaction = useCallback(
    async (id: string): Promise<void> => {
      setIsDeleting(true);
      setError(null);
      try {
        await transactionService.deleteTransaction(id);
        await refreshAll();
      } catch (err: unknown) {
        const msg = parseApiError(err);
        setError(msg);
        throw err;
      } finally {
        setIsDeleting(false);
      }
    },
    [refreshAll]
  );

  const resetFilters = useCallback(() => {
    setSearch('');
    setCategoryId('');
    setType('');
    setStartDate('');
    setEndDate('');
    setPage(0);
    setSortBy('date');
    setSortDir('desc');
  }, []);

  const handleSetSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(0);
  }, []);

  const handleSetCategoryId = useCallback((newCategoryId: string) => {
    setCategoryId(newCategoryId);
    setPage(0);
  }, []);

  const handleSetType = useCallback((newType: TransactionType | '') => {
    setType(newType);
    setPage(0);
  }, []);

  const handleSetDateRange = useCallback((newStart: string, newEnd: string) => {
    setStartDate(newStart);
    setEndDate(newEnd);
    setPage(0);
  }, []);

  const handleSetSize = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0);
  }, []);

  const handleSetSort = useCallback((newSortBy: string, newSortDir: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setPage(0);
  }, []);

  return {
    transactions,
    summary,
    isLoading,
    isSummaryLoading,
    isSubmitting,
    isDeleting,
    error,

    // Filter values
    search,
    categoryId,
    type,
    startDate,
    endDate,
    page,
    size,
    sortBy,
    sortDir,

    // Actions
    fetchTransactions,
    fetchSummary,
    refreshAll,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    setSearch: handleSetSearch,
    setCategoryId: handleSetCategoryId,
    setType: handleSetType,
    setDateRange: handleSetDateRange,
    setPage,
    setSize: handleSetSize,
    setSort: handleSetSort,
    resetFilters,
  };
};

export default useTransactions;
