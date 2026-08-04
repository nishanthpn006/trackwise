import { useState, useCallback, useEffect } from 'react';
import categoryService from '@/services/categoryService';
import type { Category, CategoryRequest, TransactionType } from '@/types/transaction';

export const useCategories = (type?: TransactionType) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories(type);
      setCategories(data);
    } catch {
      setError('Failed to fetch categories.');
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (payload: CategoryRequest): Promise<Category> => {
    const newCategory = await categoryService.createCategory(payload);
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
    createCategory,
  };
};

export default useCategories;
