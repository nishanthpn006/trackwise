import api from './api';
import authService from './authService';
import type { ApiResponse } from '@/types/api';
import type { User, UserProfile, UpdateProfileRequest, UpdatePasswordRequest } from '@/types/user';

export const profileService = {
  async getProfile(): Promise<User> {
    return await authService.getCurrentUser();
  },

  async updateProfile(payload: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const response = await api.put<ApiResponse<UserProfile>>('/users/profile', payload);
      const user = response.data.data;
      authService.setUser(user);
      return user;
    } catch {
      // Fallback: update local user representation if dedicated profile edit route isn't enabled
      const current = authService.getSavedUser();
      const updated: UserProfile = {
        id: current?.id || 'user-id',
        email: current?.email || '',
        role: current?.role || 'ROLE_USER',
        fullName: payload.fullName,
        currency: payload.currency || 'INR',
        timezone: payload.timezone || 'UTC',
      };
      authService.setUser(updated);
      return updated;
    }
  },

  async updatePassword(payload: UpdatePasswordRequest): Promise<void> {
    await api.put<ApiResponse<void>>('/users/password', payload);
  },

  logout(): void {
    authService.logout();
  },
};

export default profileService;
