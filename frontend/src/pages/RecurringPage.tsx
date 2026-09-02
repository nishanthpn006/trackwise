import React, { useState, useEffect, useCallback } from 'react';
import {
  Repeat,
  Plus,
  Play,
  Pause,
  Calendar,
  Trash2,
  Edit2,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import PageContainer from '@/components/common/PageContainer';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Dialog from '@/components/ui/Dialog';
import { useToast } from '@/hooks/useToast';
import recurringService from '@/services/recurringService';
import accountService from '@/services/accountService';
import categoryService from '@/services/categoryService';
import type {
  RecurringTransaction,
  RecurringTransactionRequest,
  RecurrenceFrequency,
} from '@/types/recurring';
import type { TransactionType } from '@/types/transaction';
import type { Account } from '@/types/account';
import type { Category } from '@/types/category';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const RecurringPage: React.FC = () => {
  const toast = useToast();
  const [recurringTxs, setRecurringTxs] = useState<RecurringTransaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecurringTransaction | null>(null);

  const [formData, setFormData] = useState<RecurringTransactionRequest>({
    title: '',
    amount: 0,
    type: 'EXPENSE',
    frequency: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    nextExecutionDate: new Date().toISOString().split('T')[0],
    description: '',
    categoryId: '',
    accountId: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [list, accs, cats] = await Promise.all([
        recurringService.getRecurringTransactions(),
        accountService.getAccounts(),
        categoryService.getCategories(),
      ]);
      setRecurringTxs(list);
      setAccounts(accs);
      setCategories(cats);
    } catch {
      toast.error('Failed to load recurring transactions');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      title: '',
      amount: 0,
      type: 'EXPENSE',
      frequency: 'MONTHLY',
      startDate: today,
      nextExecutionDate: today,
      description: '',
      categoryId: categories[0]?.id || '',
      accountId: accounts[0]?.id || '',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: RecurringTransaction) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      amount: item.amount,
      type: item.type,
      frequency: item.frequency,
      startDate: item.startDate,
      nextExecutionDate: item.nextExecutionDate,
      endDate: item.endDate,
      description: item.description || '',
      categoryId: item.category?.id || '',
      accountId: item.account?.id || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.amount <= 0) {
      toast.warning('Please enter a valid title and amount');
      return;
    }

    try {
      setSaving(true);
      if (editingItem) {
        await recurringService.updateRecurringTransaction(editingItem.id, formData);
        toast.success('Recurring rule updated');
      } else {
        await recurringService.createRecurringTransaction(formData);
        toast.success('Recurring rule created');
      }
      setDialogOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to save recurring rule');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await recurringService.toggleActive(id);
      toast.success('Recurring rule status updated');
      fetchData();
    } catch {
      toast.error('Failed to toggle status');
    }
  };

  const handleProcessDue = async () => {
    try {
      setProcessing(true);
      const generated = await recurringService.processDue();
      if (generated.length > 0) {
        toast.success(`Processed ${generated.length} due transactions safely`);
      } else {
        toast.info('All recurring transactions are up-to-date');
      }
      fetchData();
    } catch {
      toast.error('Failed to process recurring transactions');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this recurring rule?')) return;
    try {
      await recurringService.deleteRecurringTransaction(id);
      toast.success('Recurring rule deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete recurring rule');
    }
  };

  const totalMonthlyRecurringExpense = recurringTxs
    .filter((r) => r.isActive && r.type === 'EXPENSE')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalMonthlyRecurringIncome = recurringTxs
    .filter((r) => r.isActive && r.type === 'INCOME')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <PageContainer title="Recurring Transactions">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Recurring Rules & Automation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automate monthly salary credits, SIP investments, rent, and loan repayments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleProcessDue}
            isLoading={processing}
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            Process Due Now
          </Button>
          <Button variant="primary" size="md" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" />
            New Rule
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Monthly Recurring Income
          </span>
          <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-2">
            {formatCurrency(totalMonthlyRecurringIncome)}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            Salaries, interest & dividends
          </span>
        </div>

        <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Monthly Recurring Expenses
          </span>
          <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 mt-2">
            {formatCurrency(totalMonthlyRecurringExpense)}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            Rent, EMIs, SIPs & utilities
          </span>
        </div>

        <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Automation Rules
          </span>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
            {recurringTxs.filter((r) => r.isActive).length}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            {recurringTxs.filter((r) => !r.isActive).length} paused rules
          </span>
        </div>
      </div>

      {/* Rules List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 h-44 tw-animate-shimmer"
            />
          ))}
        </div>
      ) : recurringTxs.length === 0 ? (
        <EmptyState
          icon={<Repeat className="h-10 w-10 text-muted-foreground/60" />}
          title="No Recurring Automation Rules"
          description="Create recurring rules to automate transactions and keep ledgers accurate without manual entries."
          action={{
            label: 'Add Recurring Rule',
            onClick: handleOpenCreate,
          }}
        />
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recurringTxs.map((item) => {
            const isIncome = item.type === 'INCOME';
            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-[#1A2234] border ${
                  !item.isActive
                    ? 'border-slate-200 dark:border-slate-800 opacity-60'
                    : 'border-slate-200/80 dark:border-slate-800/80'
                } rounded-xl p-5 shadow-xs flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isIncome
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-rose-500/10 text-rose-600'
                        }`}
                      >
                        {isIncome ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {item.title}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {item.frequency.toLowerCase()}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        item.isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {item.isActive ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Amount
                      </span>
                      <div
                        className={`text-xl font-bold tracking-tight ${
                          isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(item.amount)}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Next Run
                      </span>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-1 justify-end">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.nextExecutionDate}
                      </div>
                    </div>
                  </div>

                  {(item.account || item.category) && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      {item.account && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">
                          {item.account.name}
                        </span>
                      )}
                      {item.category && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">
                          {item.category.name}
                        </span>
                      )}
                    </div>
                  )}

                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                  <div>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item.id)}
                      className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 text-xs font-medium ${
                        item.isActive
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                      }`}
                    >
                      {item.isActive ? (
                        <>
                          <Pause className="w-3 h-3" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" /> Resume
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingItem ? 'Edit Recurring Rule' : 'Create Recurring Rule'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Rule Title"
            placeholder="e.g. Monthly Salary, House Rent, Mutual Fund SIP"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount (₹)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount || ''}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
              }
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as TransactionType })
                }
                className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1A2234] text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value as RecurrenceFrequency })
                }
                className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1A2234] text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="WEEKLY">Weekly</option>
                <option value="DAILY">Daily</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>

            <Input
              label="Next Execution Date"
              type="date"
              value={formData.nextExecutionDate}
              onChange={(e) => setFormData({ ...formData, nextExecutionDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Linked Account
              </label>
              <select
                value={formData.accountId || ''}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value || undefined })}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1A2234] text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">None (Unassigned)</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || undefined })}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1A2234] text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">None (Uncategorized)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Notes on recurring schedule or auto-debit accounts"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1A2234] text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={saving}>
              {editingItem ? 'Save Changes' : 'Create Recurring Rule'}
            </Button>

          </div>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default RecurringPage;
