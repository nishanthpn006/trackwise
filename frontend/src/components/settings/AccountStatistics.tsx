import React from 'react';
import type { UserStatistics } from '@/types/settings';
import { Receipt, Tags, Wallet, Target, FileText, Calendar } from 'lucide-react';

interface AccountStatisticsProps {
  statistics: UserStatistics | null;
  isLoading?: boolean;
}

export const AccountStatistics: React.FC<AccountStatisticsProps> = ({ statistics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-card border border-border p-3" />
        ))}
      </div>
    );
  }

  if (!statistics) return null;

  const formatDate = (dStr?: string) => {
    if (!dStr) return 'N/A';
    try {
      return new Date(dStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dStr;
    }
  };

  const statItems = [
    { label: 'Transactions', value: statistics.transactionsCount, icon: Receipt, color: 'text-primary' },
    { label: 'Categories', value: statistics.categoriesCount, icon: Tags, color: 'text-emerald-500' },
    { label: 'Budgets', value: statistics.budgetsCount, icon: Wallet, color: 'text-amber-500' },
    { label: 'Goals', value: statistics.goalsCount, icon: Target, color: 'text-indigo-500' },
    { label: 'Reports', value: statistics.reportsCount, icon: FileText, color: 'text-purple-500' },
    { label: 'Member Since', value: formatDate(statistics.memberSince), icon: Calendar, color: 'text-teal-500' },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
      <div>
        <h3 className="text-base font-bold text-foreground">Account Usage Statistics</h3>
        <p className="text-xs text-muted-foreground">Lifetime records managed across your TrackWise account.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-3 bg-muted/20 border border-border/50 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">{item.label}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="text-xl font-bold text-foreground">{item.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountStatistics;
