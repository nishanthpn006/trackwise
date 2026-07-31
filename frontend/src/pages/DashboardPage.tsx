import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import PageContainer from '@/components/common/PageContainer';
import Loading from '@/components/common/Loading';
import transactionService from '@/services/transactionService';
import type { DashboardSummary } from '@/types/transaction';

const DashboardPage = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await transactionService.getDashboardSummary();
      setSummary(data);
    } catch {
      setErrorMessage('Failed to load dashboard summary.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center py-12">
          <Loading />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your personal financial activity</p>
        </div>
        <Link
          to="/transactions"
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg shadow hover:bg-primary/90 transition-colors"
        >
          Manage Transactions
        </Link>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
          {errorMessage}
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Net Balance Card */}
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Current Balance</p>
          <p className={`text-3xl font-extrabold ${summary && summary.balance >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {formatCurrency(summary?.balance || 0)}
          </p>
        </div>

        {/* Total Income Card */}
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm space-y-2">
          <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Total Income</p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(summary?.totalIncome || 0)}
          </p>
        </div>

        {/* Total Expense Card */}
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm space-y-2">
          <p className="text-xs font-semibold uppercase text-rose-600 dark:text-rose-400 tracking-wider">Total Expense</p>
          <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            -{formatCurrency(summary?.totalExpense || 0)}
          </p>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
          <Link to="/transactions" className="text-xs font-medium text-primary hover:underline">
            View All →
          </Link>
        </div>

        {!summary?.recentTransactions || summary.recentTransactions.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No recent transactions found.{' '}
            <Link to="/transactions" className="text-primary hover:underline font-medium">
              Add your first transaction.
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b border-border bg-muted/40">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {summary.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-muted-foreground">{tx.date}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{tx.title}</td>
                    <td className="py-3 px-4">
                      {tx.category ? (
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                          style={{
                            borderColor: tx.category.color || '#94A3B8',
                            color: tx.category.color || '#64748B',
                          }}
                        >
                          {tx.category.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">Uncategorized</span>
                      )}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold whitespace-nowrap ${
                        tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
