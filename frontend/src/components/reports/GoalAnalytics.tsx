import React from 'react';
import { Target, Calendar, Sparkles } from 'lucide-react';
import type { ReportGoalAnalytics } from '@/types/report';

interface GoalAnalyticsProps {
  data: ReportGoalAnalytics | undefined;
  isLoading?: boolean;
}

export const GoalAnalytics: React.FC<GoalAnalyticsProps> = ({ data, isLoading }) => {
  const formatCurrency = (val: number | undefined) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  if (isLoading) {
    return (
      <div className="h-64 rounded-xl bg-card border border-border p-5 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded mb-4" />
        <div className="h-20 bg-muted/40 rounded-lg" />
      </div>
    );
  }

  if (!data || data.totalGoals === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-5 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
          <Target className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">No Goal Analytics</h4>
        <p className="text-xs text-muted-foreground mt-1">Set savings targets to measure goal progress.</p>
      </div>
    );
  }

  const progressPct = Math.min(100, Math.max(0, data.overallProgressPercentage));

  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-xs flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Savings Goals Progress</h3>
          <p className="text-xs text-muted-foreground">Aggregated target achievement metrics</p>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{data.completedGoals} Completed</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
          <span className="text-[11px] text-muted-foreground font-medium uppercase">Total Target</span>
          <div className="text-lg font-bold text-foreground mt-0.5">{formatCurrency(data.totalTargetAmount)}</div>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
          <span className="text-[11px] text-muted-foreground font-medium uppercase">Total Saved</span>
          <div className="text-lg font-bold text-indigo-600 mt-0.5">{formatCurrency(data.totalSaved)}</div>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
          <span className="text-[11px] text-muted-foreground font-medium uppercase">Active Goals</span>
          <div className="text-lg font-bold text-foreground mt-0.5">{data.activeGoals}</div>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
          <span className="text-[11px] text-muted-foreground font-medium uppercase">Completion</span>
          <div className="text-lg font-bold text-emerald-600 mt-0.5">{data.overallProgressPercentage.toFixed(1)}%</div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">Overall Goal Completion</span>
          <span className="font-bold text-indigo-600">{progressPct.toFixed(1)}%</span>
        </div>
        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {data.nearestGoalName && (
        <div className="flex items-center justify-between p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <div>
              <span className="font-semibold text-foreground">Nearest Target: </span>
              <span className="text-muted-foreground">{data.nearestGoalName}</span>
            </div>
          </div>
          <span className="font-bold text-indigo-600">{data.nearestGoalDate}</span>
        </div>
      )}
    </div>
  );
};

export default GoalAnalytics;
