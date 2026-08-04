import api from './api';
import type { ApiResponse } from '@/types/api';
import type {
  NotificationItem,
  NotificationSummary,
  NotificationFilters,
} from '@/types/notification';

export const notificationService = {
  async getNotifications(filters?: NotificationFilters): Promise<NotificationItem[]> {
    const params: Record<string, string | boolean | undefined> = {};
    if (filters?.unreadOnly) params.unreadOnly = true;
    if (filters?.type && filters.type !== 'ALL') params.type = filters.type;
    if (filters?.search) params.search = filters.search;

    const response = await api.get<ApiResponse<NotificationItem[]>>('/notifications', { params });
    return response.data.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get<ApiResponse<number>>('/notifications/unread-count');
    return response.data.data;
  },

  async getSummary(): Promise<NotificationSummary> {
    const response = await api.get<ApiResponse<NotificationSummary>>('/notifications/summary');
    return response.data.data;
  },

  async markAsRead(id: string): Promise<NotificationItem> {
    const response = await api.put<ApiResponse<NotificationItem>>(`/notifications/${id}/read`);
    return response.data.data;
  },

  async markAllAsRead(): Promise<void> {
    await api.put<ApiResponse<void>>('/notifications/read-all');
  },

  async deleteNotification(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/notifications/${id}`);
  },

  async clearAllNotifications(): Promise<void> {
    await api.delete<ApiResponse<void>>('/notifications');
  },

  async generateSummaries(): Promise<void> {
    await api.post<ApiResponse<void>>('/notifications/generate-summaries');
  },
};

export default notificationService;
