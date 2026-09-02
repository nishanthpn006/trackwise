import type { Category } from './category';
import type { Account } from './account';
import type { RecurrenceFrequency } from './recurring';

export type BillStatus = 'UPCOMING' | 'DUE_SOON' | 'OVERDUE' | 'PAID';

export interface BillReminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  frequency: RecurrenceFrequency;
  status: BillStatus;
  paidAt?: string;
  notes?: string;
  category?: Category;
  account?: Account;
  daysUntilDue: number;
  createdAt: string;
  updatedAt?: string;
}

export interface BillReminderRequest {
  title: string;
  amount: number;
  dueDate: string;
  frequency?: RecurrenceFrequency;
  status?: BillStatus;
  notes?: string;
  categoryId?: string;
  accountId?: string;
}
