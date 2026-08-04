import api from './api';
import type { ApiResponse } from '@/types/api';
import type { ReportSummary, ReportFilterParams } from '@/types/report';

export const reportService = {
  async getReportDashboard(params?: ReportFilterParams): Promise<ReportSummary | null> {
    try {
      const response = await api.get<ApiResponse<ReportSummary>>('/reports/dashboard', {
        params: {
          startDate: params?.startDate,
          endDate: params?.endDate,
          search: params?.search,
          category: params?.category,
        },
      });
      return response.data.data;
    } catch {
      return null;
    }
  },

  async exportReport(params?: ReportFilterParams, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await api.get('/reports/export', {
      params: {
        startDate: params?.startDate,
        endDate: params?.endDate,
        search: params?.search,
        category: params?.category,
        format,
      },
      responseType: 'blob',
    });
    return response.data;
  },
};

export default reportService;
