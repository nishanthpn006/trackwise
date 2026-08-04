import type { TransactionType } from './transaction';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
  description?: string;
  createdAt: string;
}

export interface CategoryWithStats extends Category {
  transactionCount: number;
  totalAmount: number;
  lastUsedDate?: string | null;
  usedThisMonth?: boolean;
}

export interface CategoryRequest {
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
  description?: string;
}

export interface CategoryStatsSummary {
  totalCategories: number;
  incomeCategories: number;
  expenseCategories: number;
  mostUsedCategory: { name: string; count: number } | null;
  unusedCategories: number;
  categoriesUsedThisMonth: number;
}
