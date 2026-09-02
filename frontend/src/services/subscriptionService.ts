import api from './api';
import type { ApiResponse } from '@/types/api';
import type { Subscription, SubscriptionRequest, SubscriptionSummary, SubscriptionStatus } from '@/types/subscription';

export const subscriptionService = {
  async getSubscriptions(status?: SubscriptionStatus): Promise<Subscription[]> {
    const response = await api.get<ApiResponse<Subscription[]>>('/subscriptions', {
      params: status ? { status } : undefined,
    });
    return response.data.data || [];
  },

  async getSummary(): Promise<SubscriptionSummary> {
    const response = await api.get<ApiResponse<SubscriptionSummary>>('/subscriptions/summary');
    return response.data.data;
  },

  async getSubscriptionById(id: string): Promise<Subscription> {
    const response = await api.get<ApiResponse<Subscription>>(`/subscriptions/${id}`);
    return response.data.data;
  },

  async createSubscription(payload: SubscriptionRequest): Promise<Subscription> {
    const response = await api.post<ApiResponse<Subscription>>('/subscriptions', payload);
    return response.data.data;
  },

  async updateSubscription(id: string, payload: SubscriptionRequest): Promise<Subscription> {
    const response = await api.put<ApiResponse<Subscription>>(`/subscriptions/${id}`, payload);
    return response.data.data;
  },

  async updateStatus(id: string, status: SubscriptionStatus): Promise<Subscription> {
    const response = await api.patch<ApiResponse<Subscription>>(`/subscriptions/${id}/status`, null, {
      params: { status },
    });
    return response.data.data;
  },

  async deleteSubscription(id: string): Promise<void> {
    await api.delete(`/subscriptions/${id}`);
  },
};

export default subscriptionService;
