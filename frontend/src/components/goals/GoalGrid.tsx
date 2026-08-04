import React from 'react';
import type { SavingsGoal } from '@/types/goal';
import GoalCard from './GoalCard';
import EmptyState from '@/components/common/EmptyState';
import { Target } from 'lucide-react';

interface GoalGridProps {
  goals: SavingsGoal[];
  isLoading: boolean;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (goal: SavingsGoal) => void;
  onAddSavings: (goal: SavingsGoal) => void;
  onCreateNew: () => void;
}

export const GoalGrid: React.FC<GoalGridProps> = ({
  goals,
  isLoading,
  onEdit,
  onDelete,
  onAddSavings,
  onCreateNew,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-border/60 rounded-2xl p-5 space-y-4 bg-card/40 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-muted" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-32 bg-muted rounded-md" />
                <div className="h-3 w-20 bg-muted rounded-md" />
              </div>
            </div>
            <div className="h-3 w-full bg-muted rounded-md" />
            <div className="h-2.5 w-full rounded-full bg-muted" />
            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="h-8 rounded-md bg-muted" />
              <div className="h-8 rounded-md bg-muted" />
              <div className="h-8 rounded-md bg-muted" />
            </div>
            <div className="h-9 w-full rounded-xl bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          icon={<Target className="h-10 w-10 text-primary/60" />}
          title="No savings goals created yet"
          description="Define targets for emergency funds, vacations, tech upgrades, or long-term investments."
          action={{
            label: 'Create First Goal',
            onClick: onCreateNew,
          }}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSavings={onAddSavings}
        />
      ))}
    </div>
  );
};

export default GoalGrid;
