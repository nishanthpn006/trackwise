import { useState, useCallback } from 'react';
import transactionService from '@/services/transactionService';
import type { Transaction, TransactionRequest } from '@/types/transaction';

export const useTransactions = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = useCallback(async (payload: TransactionRequest): Promise<Transaction> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const tx = await transactionService.createTransaction(payload);
      return tx;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create transaction.';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    createTransaction,
    isSubmitting,
    error,
  };
};

export default useTransactions;
