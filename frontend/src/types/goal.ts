export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  color?: string;
  createdAt: string;
}

export interface SavingsGoalRequest {
  name: string;
  targetAmount: number;
  targetDate: string;
  color?: string;
}
