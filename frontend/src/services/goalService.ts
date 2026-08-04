import api from './api';
import type { ApiResponse } from '@/types/api';
import type {
  SavingsGoal,
  SavingsGoalRequest,
  GoalContributionRequest,
  GoalSummary,
} from '@/types/goal';

export const goalService = {
  async getGoals(): Promise<SavingsGoal[]> {
    try {
      const response = await api.get<ApiResponse<SavingsGoal[]>>('/goals');
      const data = response.data.data;
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  },

  async getGoalSummary(): Promise<GoalSummary | null> {
    try {
      const response = await api.get<ApiResponse<GoalSummary>>('/goals/summary');
      return response.data.data;
    } catch {
      return null;
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

  async addContribution(id: string, payload: GoalContributionRequest): Promise<SavingsGoal> {
    const response = await api.post<ApiResponse<SavingsGoal>>(`/goals/${id}/contributions`, payload);
    return response.data.data;
  },
};

export default goalService;
