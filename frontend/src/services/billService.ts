import api from './api';
import type { ApiResponse } from '@/types/api';
import type { BillReminder, BillReminderRequest, BillStatus } from '@/types/bill';

export const billService = {
  async getBillReminders(status?: BillStatus): Promise<BillReminder[]> {
    const response = await api.get<ApiResponse<BillReminder[]>>('/bill-reminders', {
      params: status ? { status } : undefined,
    });
    return response.data.data || [];
  },

  async getBillReminderById(id: string): Promise<BillReminder> {
    const response = await api.get<ApiResponse<BillReminder>>(`/bill-reminders/${id}`);
    return response.data.data;
  },

  async createBillReminder(payload: BillReminderRequest): Promise<BillReminder> {
    const response = await api.post<ApiResponse<BillReminder>>('/bill-reminders', payload);
    return response.data.data;
  },

  async updateBillReminder(id: string, payload: BillReminderRequest): Promise<BillReminder> {
    const response = await api.put<ApiResponse<BillReminder>>(`/bill-reminders/${id}`, payload);
    return response.data.data;
  },

  async markAsPaid(id: string, recordTransaction = true): Promise<BillReminder> {
    const response = await api.post<ApiResponse<BillReminder>>(`/bill-reminders/${id}/pay`, null, {
      params: { recordTransaction },
    });
    return response.data.data;
  },

  async deleteBillReminder(id: string): Promise<void> {
    await api.delete(`/bill-reminders/${id}`);
  },
};

export default billService;
