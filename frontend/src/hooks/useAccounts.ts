import { useState, useEffect, useCallback } from 'react';
import accountService from '@/services/accountService';
import type { Account, AccountRequest } from '@/types/account';

export const useAccounts = (includeArchived = false) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await accountService.getAccounts(includeArchived);
      setAccounts(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setIsLoading(false);
    }
  }, [includeArchived]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const createAccount = async (payload: AccountRequest) => {
    const created = await accountService.createAccount(payload);
    await fetchAccounts();
    return created;
  };

  const updateAccount = async (id: string, payload: AccountRequest) => {
    const updated = await accountService.updateAccount(id, payload);
    await fetchAccounts();
    return updated;
  };

  const deleteAccount = async (id: string) => {
    await accountService.deleteAccount(id);
    await fetchAccounts();
  };

  return {
    accounts,
    isLoading,
    error,
    refetch: fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  };
};

export default useAccounts;
