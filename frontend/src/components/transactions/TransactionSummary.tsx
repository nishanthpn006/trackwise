import React from 'react';
import type { DashboardSummary } from '@/types/transaction';
import { ArrowUpRight, ArrowDownRight, DollarSign, CreditCard } from 'lucide-react';
import { Skeleton } from '@/components/common/LoadingSkeleton';

export interface TransactionSummaryProps {
  summary: DashboardSummary | null;
  totalTransactions?: number;
  isLoading?: boolean;
}

const formatCurrency = (val: number | undefined) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0);
};

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  summary,
  totalTransactions = 0,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="bg-card border border-border/60 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-7 w-32" />
          </div>
        ))}
      </div>
    );
  }

  const netBalance = summary?.totalBalance ?? (summary ? summary.totalIncome - summary.totalExpense : 0);
  const totalIncome = summary?.totalIncome ?? 0;
  const totalExpenses = summary?.totalExpense ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Balance Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-4.5 shadow-xs hover:shadow-md transition-all space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Net Balance</span>
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <h3 className={`text-xl font-bold tracking-tight ${netBalance >= 0 ? 'text-foreground' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatCurrency(netBalance)}
          </h3>
        </div>
      </div>

      {/* Income Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-4.5 shadow-xs hover:shadow-md transition-all space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Income</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalIncome)}
          </h3>
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-4.5 shadow-xs hover:shadow-md transition-all space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Expenses</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ArrowDownRight className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {formatCurrency(totalExpenses)}
          </h3>
        </div>
      </div>

      {/* Total Transactions Count Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-4.5 shadow-xs hover:shadow-md transition-all space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Entries</span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <CreditCard className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {totalTransactions}
          </h3>
          <span className="text-[11px] text-muted-foreground font-medium">Records</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;
