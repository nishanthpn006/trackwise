import api from './api';
import type { ApiResponse } from '@/types/api';
import type { RecurringTransaction, RecurringTransactionRequest } from '@/types/recurring';

export const recurringService = {
  async getRecurringTransactions(): Promise<RecurringTransaction[]> {
    const response = await api.get<ApiResponse<RecurringTransaction[]>>('/recurring-transactions');
    return response.data.data || [];
  },

  async getRecurringTransactionById(id: string): Promise<RecurringTransaction> {
    const response = await api.get<ApiResponse<RecurringTransaction>>(`/recurring-transactions/${id}`);
    return response.data.data;
  },

  async createRecurringTransaction(payload: RecurringTransactionRequest): Promise<RecurringTransaction> {
    const response = await api.post<ApiResponse<RecurringTransaction>>('/recurring-transactions', payload);
    return response.data.data;
  },

  async updateRecurringTransaction(id: string, payload: RecurringTransactionRequest): Promise<RecurringTransaction> {
    const response = await api.put<ApiResponse<RecurringTransaction>>(`/recurring-transactions/${id}`, payload);
    return response.data.data;
  },

  async toggleActive(id: string): Promise<RecurringTransaction> {
    const response = await api.patch<ApiResponse<RecurringTransaction>>(`/recurring-transactions/${id}/toggle-active`);
    return response.data.data;
  },

  async processDue(): Promise<RecurringTransaction[]> {
    const response = await api.post<ApiResponse<RecurringTransaction[]>>('/recurring-transactions/process');
    return response.data.data || [];
  },

  async deleteRecurringTransaction(id: string): Promise<void> {
    await api.delete(`/recurring-transactions/${id}`);
  },
};

export default recurringService;
