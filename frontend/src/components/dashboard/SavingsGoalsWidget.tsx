import React, { useEffect, useState } from 'react';
import goalService from '@/services/goalService';
import type { GoalSummary, SavingsGoal } from '@/types/goal';
import { Target, ArrowRight, Calendar, PlusCircle } from 'lucide-react';
import { Link } from 'react-router';
import GoalProgress from '@/components/goals/GoalProgress';
import { formatCurrency } from '@/utils/currency';

interface SavingsGoalsWidgetProps {
  onOpenContribution?: (goal: SavingsGoal) => void;
  refreshKey?: number;
}

export const SavingsGoalsWidget: React.FC<SavingsGoalsWidgetProps> = ({
  onOpenContribution,
  refreshKey = 0,
}) => {
  const [summary, setSummary] = useState<GoalSummary | null>(null);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [sumData, goalsData] = await Promise.all([
          goalService.getGoalSummary(),
          goalService.getGoals(),
        ]);
        if (isMounted) {
          setSummary(sumData);
          setGoals(goalsData);
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);



  if (isLoading) {
    return (
      <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3">
        <div className="h-4 w-36 rounded-md tw-animate-shimmer" />
        <div className="h-14 w-full rounded-xl tw-animate-shimmer" />
        <div className="h-16 w-full rounded-xl tw-animate-shimmer" />
      </div>
    );
  }


  const nearestGoal = summary?.nearestGoal || (goals.length > 0 ? goals[0] : null);

  return (
    <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-foreground">
              Savings Goals Overview
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {summary?.activeGoals ?? 0} active • {summary?.completedGoals ?? 0} completed
            </p>
          </div>
        </div>
        <Link
          to="/goals"
          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Overall Progress Bar */}
      <div className="space-y-1 bg-muted/40 p-3 rounded-xl border border-border/60">
        <GoalProgress
          percentage={summary?.overallProgressPercentage ?? 0}
          status={summary?.overallProgressPercentage === 100 ? 'COMPLETED' : 'IN_PROGRESS'}
          showBadge={false}
          size="sm"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
          <span>Saved: {formatCurrency(summary?.totalSaved ?? 0)}</span>
          <span>Target: {formatCurrency(summary?.totalTargetAmount ?? 0)}</span>
        </div>
      </div>

      {/* Nearest Goal Highlight */}
      {nearestGoal ? (
        <div className="p-3.5 rounded-xl border border-border/60 bg-background/50 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground truncate">{nearestGoal.name}</span>
            <span className="text-[11px] text-muted-foreground flex items-center space-x-1 shrink-0">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span>{nearestGoal.daysRemaining >= 0 ? `${nearestGoal.daysRemaining}d left` : 'Overdue'}</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(nearestGoal.currentAmount)} / {formatCurrency(nearestGoal.targetAmount)}</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {Math.round(nearestGoal.completionPercentage)}%
            </span>
          </div>

          {onOpenContribution && (
            <button
              type="button"
              onClick={() => onOpenContribution(nearestGoal)}
              className="w-full py-1.5 px-2 text-[11px] font-semibold rounded-lg border border-border/80 hover:bg-muted text-foreground transition-colors flex items-center justify-center space-x-1 mt-1 cursor-pointer"
            >
              <PlusCircle className="h-3 w-3" />
              <span>Add Savings Deposit</span>
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-4 text-xs text-muted-foreground">
          <p>No active savings goals found.</p>
          <Link to="/goals" className="text-xs text-primary font-semibold hover:underline mt-1 inline-block">
            Create your first goal &rarr;
          </Link>
        </div>
      )}

      {/* Mini Stats Footer */}
      <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1 border-t border-border/40">
        <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <span className="text-[11px] text-muted-foreground block">Completed</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
            {summary?.completedGoals ?? 0}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <span className="text-[11px] text-muted-foreground block font-medium">Upcoming Deadlines</span>
          <span className="font-extrabold text-amber-600 dark:text-amber-400">
            {summary?.upcomingDeadlinesCount ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SavingsGoalsWidget;
