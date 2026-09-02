import api from './api';
import type { ApiResponse } from '@/types/api';
import type { Account, AccountRequest } from '@/types/account';

export const accountService = {
  async getAccounts(includeArchived = false): Promise<Account[]> {
    const response = await api.get<ApiResponse<Account[]>>('/accounts', {
      params: { includeArchived },
    });
    return response.data.data || [];
  },

  async getAccountById(id: string): Promise<Account> {
    const response = await api.get<ApiResponse<Account>>(`/accounts/${id}`);
    return response.data.data;
  },

  async createAccount(payload: AccountRequest): Promise<Account> {
    const response = await api.post<ApiResponse<Account>>('/accounts', payload);
    return response.data.data;
  },

  async updateAccount(id: string, payload: AccountRequest): Promise<Account> {
    const response = await api.put<ApiResponse<Account>>(`/accounts/${id}`, payload);
    return response.data.data;
  },

  async toggleArchive(id: string): Promise<Account> {
    const response = await api.patch<ApiResponse<Account>>(`/accounts/${id}/archive`);
    return response.data.data;
  },

  async deleteAccount(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`);
  },
};

export default accountService;
