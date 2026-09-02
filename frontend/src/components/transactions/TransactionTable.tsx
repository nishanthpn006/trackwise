import React from 'react';
import type { Transaction } from '@/types/transaction';
import { ArrowUpRight, ArrowDownRight, Edit2, Trash2, Tag, Calendar } from 'lucide-react';
import { SkeletonTable } from '@/components/common/LoadingSkeleton';
import { formatCurrency } from '@/utils/currency';

export interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const formatDate = (dateStr: string) => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading = false,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="p-6">
        <SkeletonTable rows={6} />
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table View (md+) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="sticky top-0 bg-card border-b border-border/80 text-xs uppercase text-muted-foreground font-semibold tracking-wider z-10">
            <tr>
              <th scope="col" className="py-3.5 px-4">
                Type
              </th>
              <th scope="col" className="py-3.5 px-4">
                Title & Description
              </th>
              <th scope="col" className="py-3.5 px-4">
                Category
              </th>
              <th scope="col" className="py-3.5 px-4">
                Account
              </th>
              <th scope="col" className="py-3.5 px-4">
                Date
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Amount
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 bg-card">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'INCOME';
              const categoryColor = tx.category?.color || (isIncome ? '#10B981' : '#F43F5E');

              return (
                <tr key={tx.id} className="hover:bg-muted/40 transition-colors group">
                  {/* Type Icon Column */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center justify-center p-2 rounded-xl border ${
                        isIncome
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                      }`}
                      title={tx.type}
                    >
                      {isIncome ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    </div>
                  </td>

                  {/* Title & Notes Column */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-foreground tracking-tight text-sm">{tx.title}</p>
                    {tx.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{tx.description}</p>
                    )}
                  </td>

                  {/* Category Column */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {tx.category ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                        style={{
                          backgroundColor: `${categoryColor}15`,
                          borderColor: `${categoryColor}40`,
                          color: categoryColor,
                        }}
                      >
                        <Tag className="h-3 w-3" />
                        {tx.category.name}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Uncategorized</span>
                    )}
                  </td>

                  {/* Account Column */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {tx.account ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-muted/60 text-muted-foreground border border-border/40">
                        {tx.account.name}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                  </td>

                  {/* Date Column */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground font-medium">
                    {formatDate(tx.date)}
                  </td>


                  {/* Amount Column */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-sm tabular-nums font-mono">
                    <span className={isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onEdit(tx)}
                        aria-label={`Edit ${tx.title}`}
                        title="Edit Transaction"
                        className="p-1.5 rounded-lg border border-border/60 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(tx)}
                        aria-label={`Delete ${tx.title}`}
                        title="Delete Transaction"
                        className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (< md) */}
      <div className="block md:hidden divide-y divide-border/60 bg-card">
        {transactions.map((tx) => {
          const isIncome = tx.type === 'INCOME';
          const categoryColor = tx.category?.color || (isIncome ? '#10B981' : '#F43F5E');

          return (
            <div key={tx.id} className="p-4 space-y-3 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {isIncome ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm leading-tight">{tx.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {tx.category ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                          style={{
                            backgroundColor: `${categoryColor}15`,
                            borderColor: `${categoryColor}40`,
                            color: categoryColor,
                          }}
                        >
                          {tx.category.name}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">Uncategorized</span>
                      )}
                      {tx.account && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {tx.account.name}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Calendar className="h-2.5 w-2.5" />
                        {formatDate(tx.date)}
                      </span>

                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`font-bold text-sm ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>

              {tx.description && (
                <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/40">
                  {tx.description}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => onEdit(tx)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-border/80 bg-background hover:bg-muted text-foreground"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(tx)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionTable;
