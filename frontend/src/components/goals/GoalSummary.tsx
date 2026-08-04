import React from 'react';
import {
  Target,
  CheckCircle2,
  Clock,
  PiggyBank,
  TrendingUp,
  AlertCircle,
  Percent,
} from 'lucide-react';
import type { GoalSummary as GoalSummaryType } from '@/types/goal';

interface GoalSummaryProps {
  summary: GoalSummaryType | null;
  isLoading?: boolean;
}

export const GoalSummary: React.FC<GoalSummaryProps> = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card/60 border border-border/80 space-y-2 animate-pulse">
            <div className="h-4 w-20 bg-muted rounded-md" />
            <div className="h-6 w-24 bg-muted rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);

  const cards = [
    {
      title: 'Total Goals',
      value: summary?.totalGoals ?? 0,
      subtext: 'Configured milestones',
      icon: <Target className="h-4 w-4 text-blue-500" />,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Active Goals',
      value: summary?.activeGoals ?? 0,
      subtext: 'In progress',
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Completed',
      value: summary?.completedGoals ?? 0,
      subtext: 'Target reached',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Target Amount',
      value: formatCurrency(summary?.totalTargetAmount ?? 0),
      subtext: 'Combined targets',
      icon: <TrendingUp className="h-4 w-4 text-purple-500" />,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Total Saved',
      value: formatCurrency(summary?.totalSaved ?? 0),
      subtext: 'Current total savings',
      icon: <PiggyBank className="h-4 w-4 text-teal-500" />,
      color: 'text-teal-600 dark:text-teal-400',
    },
    {
      title: 'Remaining',
      value: formatCurrency(summary?.remainingSavings ?? 0),
      subtext: 'Amount needed',
      icon: <AlertCircle className="h-4 w-4 text-rose-500" />,
      color: 'text-rose-600 dark:text-rose-400',
    },
    {
      title: 'Overall Progress',
      value: `${Math.round(summary?.overallProgressPercentage ?? 0)}%`,
      subtext: 'Completion rate',
      icon: <Percent className="h-4 w-4 text-indigo-500" />,
      color: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="p-4 rounded-2xl bg-card/70 border border-border/80 shadow-xs hover:border-primary/30 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between space-x-2">
            <span className="text-xs font-medium text-muted-foreground truncate">{card.title}</span>
            <div className="p-1.5 rounded-lg bg-muted/60 shrink-0">{card.icon}</div>
          </div>
          <div className="mt-2">
            <div className={`text-xl font-extrabold tracking-tight ${card.color}`}>{card.value}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalSummary;
