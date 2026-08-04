import api from './api';
import type { ApiResponse, PagedResponse } from '@/types/api';
import type { SavingsGoal, SavingsGoalRequest } from '@/types/goal';

export const goalService = {
  async getGoals(): Promise<SavingsGoal[]> {
    try {
      const response = await api.get<ApiResponse<SavingsGoal[] | PagedResponse<SavingsGoal>>>('/goals');
      const data = response.data.data;
      if (Array.isArray(data)) return data;
      return data.content || [];
    } catch {
      // Fallback empty array when backend goals module is not enabled
      return [];
    }
  },

  async getGoalById(id: string): Promise<SavingsGoal | null> {
    const response = await api.get<ApiResponse<SavingsGoal>>(`/goals/${id}`);
    return response.data.data;
  },

  async createGoal(payload: SavingsGoalRequest): Promise<SavingsGoal> {
    const response = await api.post<ApiResponse<SavingsGoal>>('/goals', payload);
    return response.data.data;
  },

  async updateGoal(id: string, payload: SavingsGoalRequest): Promise<SavingsGoal> {
    const response = await api.put<ApiResponse<SavingsGoal>>(`/goals/${id}`, payload);
    return response.data.data;
  },

  async deleteGoal(id: string): Promise<void> {
    await api.delete(`/goals/${id}`);
  },
};

export default goalService;
