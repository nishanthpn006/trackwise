import type { Category } from './category';
import type { Account } from './account';
import type { TransactionType } from './transaction';

export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface RecurringTransaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  startDate: string;
  nextExecutionDate: string;
  endDate?: string;
  lastExecutedAt?: string;
  isActive: boolean;
  description?: string;
  category?: Category;
  account?: Account;
  createdAt: string;
  updatedAt?: string;
}

export interface RecurringTransactionRequest {
  title: string;
  amount: number;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  startDate: string;
  nextExecutionDate?: string;
  endDate?: string;
  categoryId?: string;
  accountId?: string;
  description?: string;
}
