import api from './api';
import type { ApiResponse } from '@/types/auth';
import type {
  DashboardSummary,
  PagedResponse,
  Transaction,
  TransactionQueryParams,
  TransactionRequest,
} from '@/types/transaction';

export const transactionService = {
  async getTransactions(params?: TransactionQueryParams): Promise<PagedResponse<Transaction>> {
    const response = await api.get<ApiResponse<PagedResponse<Transaction>>>('/transactions', {
      params,
    });
    return response.data.data;
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await api.get<ApiResponse<DashboardSummary>>('/transactions/summary');
    return response.data.data;
  },

  async getTransactionById(id: string): Promise<Transaction> {
    const response = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return response.data.data;
  },

  async createTransaction(payload: TransactionRequest): Promise<Transaction> {
    const response = await api.post<ApiResponse<Transaction>>('/transactions', payload);
    return response.data.data;
  },

  async updateTransaction(id: string, payload: TransactionRequest): Promise<Transaction> {
    const response = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, payload);
    return response.data.data;
  },

  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};

export default transactionService;
