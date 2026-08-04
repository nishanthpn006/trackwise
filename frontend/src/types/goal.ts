export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ALMOST_COMPLETE' | 'COMPLETED' | 'OVERDUE';

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  completionPercentage: number;
  targetDate: string;
  category?: string;
  icon?: string;
  color?: string;
  description?: string;
  status: GoalStatus;
  daysRemaining: number;
  contributions?: GoalContribution[];
  createdAt: string;
  updatedAt?: string;
}

export interface SavingsGoalRequest {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate: string;
  category?: string;
  icon?: string;
  color?: string;
  description?: string;
}

export interface GoalContributionRequest {
  amount: number;
  date?: string;
  notes?: string;
}

export interface GoalSummary {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  overdueGoals: number;
  totalTargetAmount: number;
  totalSaved: number;
  remainingSavings: number;
  overallProgressPercentage: number;
  nearestGoal?: SavingsGoal;
  upcomingDeadlinesCount: number;
}

export type GoalSortOption = 'NEWEST' | 'OLDEST' | 'HIGHEST_PROGRESS' | 'LOWEST_PROGRESS' | 'TARGET_DATE';

export interface GoalFilterParams {
  search?: string;
  status?: GoalStatus | 'ALL';
  sort?: GoalSortOption;
}
