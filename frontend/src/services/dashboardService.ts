import api from './api';
import type { ApiResponse } from '@/types/auth';
import type { DashboardAnalytics, DashboardSummary, DashboardPeriod } from '@/types/dashboard';

export const dashboardService = {
  getSummary: async (
    period: DashboardPeriod = 'THIS_MONTH',
    startDate?: string,
    endDate?: string
  ): Promise<DashboardSummary> => {
    const params = new URLSearchParams();
    params.set('period', period);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    const response = await api.get<ApiResponse<DashboardSummary>>(`/dashboard/summary?${params.toString()}`);
    return response.data.data;
  },

  getAnalytics: async (): Promise<DashboardAnalytics> => {
    const response = await api.get<ApiResponse<DashboardAnalytics>>('/dashboard/analytics');
    return response.data.data;
  },
};

export default dashboardService;

