import React from 'react';
import { Link } from 'react-router';
import type { Transaction } from '@/types/transaction';
import EmptyState from '@/components/common/EmptyState';
import { ArrowRight, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

export interface RecentTransactionsCardProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({
  transactions,
  isLoading = false,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const recentTxs = transactions.slice(0, 5);

  return (
    <div className="bg-card border border-border/60 rounded-xl shadow-xs p-5 sm:p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">Recent Transactions</h2>
          <p className="text-[11px] text-muted-foreground">Your 5 latest financial activities</p>
        </div>
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3 py-2">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="h-12 bg-muted/40 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : recentTxs.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="h-8 w-8 text-muted-foreground/60" />}
          title="No recent transactions"
          description="You haven't logged any income or expense entries yet."
          action={{
            label: 'Add Transaction',
            href: '/transactions',
          }}
          className="py-6"
        />
      ) : (
        <>
          {/* Mobile Stacked Card View (<640px) */}
          <div className="sm:hidden space-y-2.5">
            {recentTxs.map((tx) => {
              const isIncome = tx.type === 'INCOME';
              return (
                <div
                  key={tx.id}
                  className="p-3 bg-muted/20 border border-border/40 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground truncate">{tx.title}</p>
                      {tx.category && (
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-semibold border shrink-0"
                          style={{
                            borderColor: tx.category.color ? `${tx.category.color}40` : '#94A3B840',
                            backgroundColor: tx.category.color ? `${tx.category.color}15` : '#94A3B815',
                            color: tx.category.color || '#64748B',
                          }}
                        >
                          {tx.category.name}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{formatDate(tx.date)}</p>
                  </div>

                  <div
                    className={`font-bold whitespace-nowrap shrink-0 text-right ${
                      isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    <div className="inline-flex items-center justify-end gap-0.5">
                      {isIncome ? (
                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                      )}
                      <span>{isIncome ? '+' : '-'}{formatCurrency(tx.amount)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop & Tablet Table View (≥640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/60 bg-muted/30">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-md">Date</th>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right rounded-r-md">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {recentTxs.map((tx) => {
                  const isIncome = tx.type === 'INCOME';
                  return (
                    <tr key={tx.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="py-3 px-3 whitespace-nowrap text-muted-foreground">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3 px-3 font-medium text-foreground max-w-[180px] truncate">
                        {tx.title}
                      </td>
                      <td className="py-3 px-3">
                        {tx.category ? (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border"
                            style={{
                              borderColor: tx.category.color ? `${tx.category.color}40` : '#94A3B840',
                              backgroundColor: tx.category.color ? `${tx.category.color}15` : '#94A3B815',
                              color: tx.category.color || '#64748B',
                            }}
                          >
                            {tx.category.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/70 italic text-[10px]">Uncategorized</span>
                        )}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-bold whitespace-nowrap ${
                          isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        <div className="inline-flex items-center justify-end gap-0.5">
                          {isIncome ? (
                            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                          )}
                          <span>{isIncome ? '+' : '-'}{formatCurrency(tx.amount)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(RecentTransactionsCard);
