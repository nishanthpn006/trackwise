export type BudgetPeriod = 'MONTHLY' | 'WEEKLY' | 'YEARLY';
export type BudgetStatus = 'ON_TRACK' | 'AT_RISK' | 'OVER_BUDGET';

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string;
  // Denormalized category info (from backend join)
  categoryId?: string;
  categoryName?: string;
  categoryColor?: string;
  categoryIcon?: string;
}

export interface BudgetRequest {
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  categoryId?: string;
}

export interface BudgetStatsSummary {
  totalBudgets: number;
  totalAllocated: number;
  totalSpent: number;
  overBudgetCount: number;
  onTrackCount: number;
  atRiskCount: number;
}

