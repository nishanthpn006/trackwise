import { useState, useCallback } from 'react';
import { parseApiError } from '@/services/api';

export interface UseApiResult<T, P extends unknown[]> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (...args: P) => Promise<T | null>;
  reset: () => void;
}

/**
 * useApi — Generic custom hook for managing API call lifecycle state (loading, data, error).
 */
export function useApi<T, P extends unknown[]>(
  apiFunc: (...args: P) => Promise<T>
): UseApiResult<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err: unknown) {
        const message = parseApiError(err);
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
}

export default useApi;
