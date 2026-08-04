export type DateRangePreset =
  | 'TODAY'
  | 'YESTERDAY'
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'LAST_90_DAYS'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'THIS_YEAR'
  | 'CUSTOM';

export interface ReportFilterParams {
  preset: DateRangePreset;
  startDate?: string;
  endDate?: string;
  search?: string;
  category?: string;
}

export interface ReportCategoryBreakdown {
  categoryName: string;
  icon?: string;
  color?: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface ReportTrendPoint {
  label: string;
  income: number;
  expense: number;
  netCashFlow: number;
}

export interface ReportBudgetAnalytics {
  totalAllocated: number;
  totalSpent: number;
  remainingBudget: number;
  budgetUtilizationPercentage: number;
  totalBudgets: number;
  overbudgetCount: number;
  atRiskCount: number;
  onTrackCount: number;
  budgetHealthScore: number;
}

export interface ReportGoalAnalytics {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalTargetAmount: number;
  totalSaved: number;
  overallProgressPercentage: number;
  nearestGoalName?: string;
  nearestGoalDate?: string;
}

export interface ReportFinancialInsights {
  highestCategoryName?: string;
  highestCategoryAmount: number;
  largestExpenseTitle?: string;
  largestExpenseAmount: number;
  largestIncomeTitle?: string;
  largestIncomeAmount: number;
  averageMonthlySavings: number;
  bestSavingsMonth?: string;
  worstSpendingMonth?: string;
  budgetStatusMessage?: string;
  goalProgressMessage?: string;
}

export interface ReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  averageDailySpend: number;
  averageMonthlySpend: number;
  largestExpense: number;
  largestIncome: number;
  transactionsCount: number;
  savingsRatePercentage: number;
  budgetUtilizationPercentage: number;
  categoryBreakdown: ReportCategoryBreakdown[];
  incomeVsExpenseTrend: ReportTrendPoint[];
  cashFlowTrend: ReportTrendPoint[];
  spendingTrend: ReportTrendPoint[];
  budgetAnalytics: ReportBudgetAnalytics;
  goalAnalytics: ReportGoalAnalytics;
  topCategories: ReportCategoryBreakdown[];
  insights: ReportFinancialInsights;
  monthlyBreakdown: ReportTrendPoint[];
}
