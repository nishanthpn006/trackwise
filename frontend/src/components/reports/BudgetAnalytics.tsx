import React from 'react';
import { Wallet, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { ReportBudgetAnalytics } from '@/types/report';
import { formatCurrency } from '@/utils/currency';

interface BudgetAnalyticsProps {
  data: ReportBudgetAnalytics | undefined;
  isLoading?: boolean;
}

export const BudgetAnalytics: React.FC<BudgetAnalyticsProps> = ({ data, isLoading }) => {

  if (isLoading) {
    return (
      <div className="h-64 rounded-xl bg-card border border-border p-5 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded mb-4" />
        <div className="h-20 bg-muted/40 rounded-lg" />
      </div>
    );
  }

  if (!data || data.totalBudgets === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-5 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
          <Wallet className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">No Budget Analytics</h4>
        <p className="text-xs text-muted-foreground mt-1">Create budget allocations to track budget performance.</p>
      </div>
    );
  }

  const utilPct = Math.min(100, Math.max(0, data.budgetUtilizationPercentage));

  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-xs flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Budget Performance</h3>
          <p className="text-xs text-muted-foreground">Allocation health & overspending metrics</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Health Score: {data.budgetHealthScore}/100</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
          <span className="text-[11px] text-muted-foreground font-medium uppercase">Allocated</span>
          <div className="text-lg font-bold text-foreground mt-0.5">{formatCurrency(data.totalAllocated)}</div>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
          <span className="text-[11px] text-muted-foreground font-medium uppercase">Spent</span>
          <div className="text-lg font-bold text-foreground mt-0.5">{formatCurrency(data.totalSpent)}</div>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
          <span className="text-[11px] text-muted-foreground font-medium uppercase">Remaining</span>
          <div className="text-lg font-bold text-emerald-600 mt-0.5">{formatCurrency(data.remainingBudget)}</div>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
          <span className="text-[11px] text-muted-foreground font-medium uppercase">Overbudget</span>
          <div className={`text-lg font-bold mt-0.5 ${data.overbudgetCount > 0 ? 'text-rose-500' : 'text-foreground'}`}>
            {data.overbudgetCount} Budgets
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">Overall Utilization</span>
          <span className="font-bold text-foreground">{data.budgetUtilizationPercentage.toFixed(1)}%</span>
        </div>
        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              utilPct > 90 ? 'bg-rose-500' : utilPct > 75 ? 'bg-amber-500' : 'bg-primary'
            }`}
            style={{ width: `${utilPct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-border text-muted-foreground">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>On Track: {data.onTrackCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>At Risk: {data.atRiskCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>Over: {data.overbudgetCount}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetAnalytics;
