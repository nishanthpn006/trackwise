import type { Transaction } from './transaction';

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
  recentTransactions: Transaction[];
}
