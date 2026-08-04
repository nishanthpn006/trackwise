import React from 'react';
import type { GoalStatus } from '@/types/goal';
import { CheckCircle2, Clock, AlertTriangle, Sparkles, CircleDashed } from 'lucide-react';

interface GoalProgressProps {
  percentage: number;
  status: GoalStatus;
  color?: string;
  showBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const GoalProgress: React.FC<GoalProgressProps> = ({
  percentage,
  status,
  color,
  showBadge = true,
  size = 'md',
}) => {
  const pct = Math.min(100, Math.max(0, Math.round(percentage || 0)));

  const renderStatusBadge = (s: GoalStatus) => {
    switch (s) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
      case 'ALMOST_COMPLETE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 gap-1">
            <Sparkles className="h-3 w-3" />
            Almost Done
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Overdue
          </span>
        );
      case 'NOT_STARTED':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted/60 text-muted-foreground border border-border/80 gap-1">
            <CircleDashed className="h-3 w-3" />
            Not Started
          </span>
        );
    }
  };

  const getBarColor = () => {
    if (color) return color;
    if (status === 'COMPLETED') return '#10B981';
    if (status === 'ALMOST_COMPLETE') return '#8B5CF6';
    if (status === 'OVERDUE') return '#F43F5E';
    if (status === 'IN_PROGRESS') return '#3B82F6';
    return '#9CA3AF';
  };

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2.5';

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">{pct}% Completed</span>
        {showBadge && renderStatusBadge(status)}
      </div>
      <div className={`w-full bg-secondary/80 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%`, backgroundColor: getBarColor() }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default GoalProgress;
