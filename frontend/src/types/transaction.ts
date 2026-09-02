import type { Category, CategoryRequest } from './category';
import type { Account } from './account';
import type { PagedResponse } from './api';
import type { DashboardSummary } from './dashboard';

export type { Category, CategoryRequest, Account, PagedResponse, DashboardSummary };

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  description?: string;
  date: string;
  category?: Category;
  account?: Account;
  createdAt: string;
}

export interface TransactionRequest {
  title: string;
  amount: number;
  type: TransactionType;
  categoryId?: string;
  accountId?: string;
  date: string;
  description?: string;
}


export interface TransactionQueryParams {
  search?: string;
  categoryId?: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
