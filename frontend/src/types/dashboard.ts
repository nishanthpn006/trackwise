import type { Transaction } from './transaction';
import type { Account } from './account';

export type DashboardPeriod = 'THIS_MONTH' | 'LAST_MONTH' | 'ALL_TIME' | 'CUSTOM';

export interface CategoryBreakdownItem {
  categoryName: string;
  color?: string;
  amount: number;
  percentage: number;
}

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  savings: number;
  savingsRate?: number;
  topCategory?: string | null;
  monthlySavingsPercentage?: number;
  averageDailySpend?: number;
  transactionsThisMonth?: number;
  transactionCount?: number;
  period?: string;
  startDate?: string;
  endDate?: string;
  recentTransactions: Transaction[];
  categoryBreakdown?: CategoryBreakdownItem[];
  accounts?: Account[];
}

// ─── Analytics types ─────────────────────────────────────────────────────────

export interface MonthlyDataPoint {
  month: string;
  income: number;
  expense: number;
}

export interface SpendingTrendPoint {
  date: string;
  amount: number;
}

export interface FinancialInsights {
  highestSpendingCategory: string | null;
  monthlySavingsPercentage: number;
  averageDailySpending: number;
  transactionCount: number;
  currentMonthBalance: number;
}

export interface DashboardAnalytics {
  monthlyData: MonthlyDataPoint[];
  categoryBreakdown: CategoryBreakdownItem[];
  spendingTrend: SpendingTrendPoint[];
  financialInsights: FinancialInsights;
}
