import api from './api';
import type { ApiResponse } from '@/types/api';
import type {
  UserProfileData,
  UpdateProfilePayload,
  UpdatePasswordPayload,
  UserPreferences,
  UserNotifications,
  UserStatistics,
} from '@/types/settings';

export const settingsService = {
  async getProfile(): Promise<UserProfileData> {
    const response = await api.get<ApiResponse<UserProfileData>>('/users/profile');
    return response.data.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfileData> {
    const response = await api.put<ApiResponse<UserProfileData>>('/users/profile', payload);
    return response.data.data;
  },

  async updatePassword(payload: UpdatePasswordPayload): Promise<void> {
    await api.put<ApiResponse<void>>('/users/password', payload);
  },

  async updatePreferences(payload: Partial<UserPreferences>): Promise<UserProfileData> {
    const response = await api.put<ApiResponse<UserProfileData>>('/users/preferences', payload);
    return response.data.data;
  },

  async updateNotifications(payload: Partial<UserNotifications>): Promise<UserProfileData> {
    const response = await api.put<ApiResponse<UserProfileData>>('/users/notifications', payload);
    return response.data.data;
  },

  async updateAvatar(avatarUrl: string): Promise<UserProfileData> {
    const response = await api.post<ApiResponse<UserProfileData>>('/users/avatar', { avatarUrl });
    return response.data.data;
  },

  async deleteAvatar(): Promise<UserProfileData> {
    const response = await api.delete<ApiResponse<UserProfileData>>('/users/avatar');
    return response.data.data;
  },

  async getStatistics(): Promise<UserStatistics> {
    const response = await api.get<ApiResponse<UserStatistics>>('/users/statistics');
    return response.data.data;
  },

  async exportPersonalData(format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await api.get('/reports/export', {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  async deleteAccount(password: string): Promise<void> {
    await api.delete<ApiResponse<void>>('/users/account', {
      data: { password },
    });
  },
};

export default settingsService;
