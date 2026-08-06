import React from 'react';
import type { SavingsGoal } from '@/types/goal';
import GoalProgress from './GoalProgress';
import { renderGoalIcon } from '@/utils/goalUtils';
import {
  PlusCircle,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  Tag,
} from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface GoalCardProps {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (goal: SavingsGoal) => void;
  onAddSavings: (goal: SavingsGoal) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onAddSavings,
}) => {

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No target date';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const getDaysRemainingText = () => {
    if (goal.status === 'COMPLETED') return 'Target Reached!';
    if (goal.daysRemaining < 0) return `Overdue by ${Math.abs(goal.daysRemaining)} days`;
    if (goal.daysRemaining === 0) return 'Due today!';
    return `${goal.daysRemaining} days left`;
  };

  return (
    <div className="flex flex-col justify-between border border-border/80 bg-card/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-300 group space-y-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between space-x-2">
          <div className="flex items-center space-x-3">
            <div
              className="p-2.5 rounded-xl border border-primary/10 text-primary transition-transform duration-200 group-hover:scale-105"
              style={{
                backgroundColor: goal.color ? `${goal.color}15` : undefined,
                color: goal.color || undefined,
              }}
            >
              {renderGoalIcon(goal.icon)}
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-foreground line-clamp-1">
                {goal.name}
              </h3>
              {goal.category && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-0.5">
                  <Tag className="h-3 w-3" />
                  <span>{goal.category}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => onEdit(goal)}
              aria-label={`Edit goal ${goal.name}`}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(goal)}
              aria-label={`Delete goal ${goal.name}`}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Body Description */}
        {goal.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {goal.description}
          </p>
        )}

        {/* Progress Bar & Status */}
        <GoalProgress
          percentage={goal.completionPercentage}
          status={goal.status}
          color={goal.color}
        />

        {/* Financial Breakdown Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-muted/40 text-xs">
          <div>
            <span className="text-[11px] text-muted-foreground block">Target</span>
            <span className="font-semibold text-foreground truncate block">
              {formatCurrency(goal.targetAmount)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Saved</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate block">
              {formatCurrency(goal.currentAmount)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Remaining</span>
            <span className="font-semibold text-rose-600 dark:text-rose-400 truncate block">
              {formatCurrency(goal.remainingAmount)}
            </span>
          </div>
        </div>

        {/* Timeline Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
          <div className="flex items-center space-x-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span>Target: {formatDate(goal.targetDate)}</span>
          </div>
          <div className="flex items-center space-x-1.5 font-medium">
            <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span>{getDaysRemainingText()}</span>
          </div>
        </div>
      </div>

      {/* Footer / Add Savings Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => onAddSavings(goal)}
          disabled={goal.status === 'COMPLETED'}
          className={`w-full py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            goal.status === 'COMPLETED'
              ? 'bg-muted/60 text-muted-foreground cursor-not-allowed border border-border/60'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs'
          }`}
        >
          <PlusCircle className="h-4 w-4" />
          <span>{goal.status === 'COMPLETED' ? 'Goal Completed' : 'Add Savings Deposit'}</span>
        </button>
      </div>
    </div>
  );
};

export default GoalCard;
