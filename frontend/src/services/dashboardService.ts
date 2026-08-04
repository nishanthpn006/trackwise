import api from './api';
import type { ApiResponse } from '@/types/auth';
import type { DashboardAnalytics, DashboardSummary } from '@/types/dashboard';

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
    return response.data.data;
  },

  getAnalytics: async (): Promise<DashboardAnalytics> => {
    const response = await api.get<ApiResponse<DashboardAnalytics>>('/dashboard/analytics');
    return response.data.data;
  },
};

export default dashboardService;

