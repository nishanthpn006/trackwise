import api from './api';
import type { ApiResponse } from '@/types/auth';
import type { Category, CategoryRequest, TransactionType } from '@/types/transaction';

export const categoryService = {
  async getCategories(type?: TransactionType): Promise<Category[]> {
    const params = type ? { type } : {};
    const response = await api.get<ApiResponse<Category[]>>('/categories', { params });
    return response.data.data;
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  },

  async createCategory(payload: CategoryRequest): Promise<Category> {
    const response = await api.post<ApiResponse<Category>>('/categories', payload);
    return response.data.data;
  },

  async updateCategory(id: string, payload: CategoryRequest): Promise<Category> {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, payload);
    return response.data.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

export default categoryService;
