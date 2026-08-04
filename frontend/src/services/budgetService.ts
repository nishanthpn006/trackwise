import api from './api';
import type { ApiResponse, PagedResponse } from '@/types/api';
import type { Budget, BudgetRequest } from '@/types/budget';

export const budgetService = {
  async getBudgets(): Promise<Budget[]> {
    try {
      const response = await api.get<ApiResponse<Budget[] | PagedResponse<Budget>>>('/budgets');
      const data = response.data.data;
      if (Array.isArray(data)) return data;
      return data.content || [];
    } catch {
      // Fallback empty array when backend budget module is not enabled
      return [];
    }
  },

  async getBudgetById(id: string): Promise<Budget | null> {
    const response = await api.get<ApiResponse<Budget>>(`/budgets/${id}`);
    return response.data.data;
  },

  async createBudget(payload: BudgetRequest): Promise<Budget> {
    const response = await api.post<ApiResponse<Budget>>('/budgets', payload);
    return response.data.data;
  },

  async updateBudget(id: string, payload: BudgetRequest): Promise<Budget> {
    const response = await api.put<ApiResponse<Budget>>(`/budgets/${id}`, payload);
    return response.data.data;
  },

  async deleteBudget(id: string): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },
};

export default budgetService;
