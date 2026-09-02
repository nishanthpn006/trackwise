import type { Category } from './category';
import type { Account } from './account';

export type BillingCycle = 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  nextBillingDate: string;
  status: SubscriptionStatus;
  description?: string;
  reminderDaysBefore?: number;
  category?: Category;
  account?: Account;
  daysUntilBilling: number;
  createdAt: string;
  updatedAt?: string;
}

export interface SubscriptionRequest {
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  nextBillingDate: string;
  status?: SubscriptionStatus;
  description?: string;
  reminderDaysBefore?: number;
  categoryId?: string;
  accountId?: string;
}

export interface SubscriptionSummary {
  monthlyTotal: number;
  yearlyTotal: number;
  activeCount: number;
  upcomingRenewals: Subscription[];
}
