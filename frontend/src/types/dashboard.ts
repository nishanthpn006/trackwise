import type { Transaction } from './transaction';

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
  recentTransactions: Transaction[];
}

// ─── Analytics types ─────────────────────────────────────────────────────────

export interface MonthlyDataPoint {
  /** Human-readable month label, e.g. "Jan 2025" */
  month: string;
  income: number;
  expense: number;
}

export interface CategoryBreakdownItem {
  categoryName: string;
  /** Hex colour string */
  color: string;
  amount: number;
  /** Percentage of total expenses (0–100) */
  percentage: number;
}

export interface SpendingTrendPoint {
  /** ISO-8601 date string, e.g. "2025-01-15" */
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

