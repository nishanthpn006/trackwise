import api from './api';
import type { ApiResponse } from '@/types/api';
import type { ImportResult } from '@/types/data';

export const dataService = {
  async exportTransactions(): Promise<Blob> {
    const response = await api.get('/data/export/transactions', {
      responseType: 'blob',
    });
    return response.data;
  },

  async exportFullBackup(): Promise<Blob> {
    const response = await api.get('/data/export/backup', {
      responseType: 'blob',
    });
    return response.data;
  },

  async downloadTemplate(): Promise<Blob> {
    const response = await api.get('/data/template', {
      responseType: 'blob',
    });
    return response.data;
  },

  async importTransactions(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<ImportResult>>('/data/import/transactions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};

export default dataService;
