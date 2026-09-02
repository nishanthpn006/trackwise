import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  CheckCircle,
  Trash2,
  Edit2,
  Zap,
} from 'lucide-react';
import PageContainer from '@/components/common/PageContainer';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Dialog from '@/components/ui/Dialog';
import { useToast } from '@/hooks/useToast';
import billService from '@/services/billService';
import accountService from '@/services/accountService';
import categoryService from '@/services/categoryService';
import type {
  BillReminder,
  BillReminderRequest,
} from '@/types/bill';

import type { RecurrenceFrequency } from '@/types/recurring';
import type { Account } from '@/types/account';
import type { Category } from '@/types/category';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const BillsPage: React.FC = () => {
  const toast = useToast();
  const [bills, setBills] = useState<BillReminder[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'DUE_SOON' | 'UPCOMING' | 'OVERDUE' | 'PAID'>('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<BillReminder | null>(null);

  const [formData, setFormData] = useState<BillReminderRequest>({
    title: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    frequency: 'MONTHLY',
    status: 'UPCOMING',
    notes: '',
    categoryId: '',
    accountId: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [billList, accs, cats] = await Promise.all([
        billService.getBillReminders(),
        accountService.getAccounts(),
        categoryService.getCategories(),
      ]);
      setBills(billList);
      setAccounts(accs);
      setCategories(cats);
    } catch {
      toast.error('Failed to load bill reminders');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditingBill(null);
    setFormData({
      title: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      frequency: 'MONTHLY',
      status: 'UPCOMING',
      notes: '',
      categoryId: categories[0]?.id || '',
      accountId: accounts[0]?.id || '',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (bill: BillReminder) => {
    setEditingBill(bill);
    setFormData({
      title: bill.title,
      amount: bill.amount,
      dueDate: bill.dueDate,
      frequency: bill.frequency,
      status: bill.status,
      notes: bill.notes || '',
      categoryId: bill.category?.id || '',
      accountId: bill.account?.id || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.amount <= 0) {
      toast.warning('Please enter a valid bill title and amount');
      return;
    }

    try {
      setSaving(true);
      if (editingBill) {
        await billService.updateBillReminder(editingBill.id, formData);
        toast.success('Bill reminder updated');
      } else {
        await billService.createBillReminder(formData);
        toast.success('Bill reminder added');
      }
      setDialogOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to save bill reminder');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPaid = async (bill: BillReminder) => {
    const recordTx = window.confirm(
      `Mark "${bill.title}" as Paid and log a ₹${bill.amount} Expense transaction?`
    );
    try {
      await billService.markAsPaid(bill.id, recordTx);
      toast.success('Bill marked as Paid');
      fetchData();
    } catch {
      toast.error('Failed to update bill');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this bill reminder?')) return;
    try {
      await billService.deleteBillReminder(id);
      toast.success('Bill reminder deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete bill reminder');
    }
  };


  const filteredBills = bills.filter((b) => {
    if (activeTab === 'ALL') return true;
    return b.status === activeTab;
  });

  const dueSoonCount = bills.filter((b) => b.status === 'DUE_SOON').length;
  const overdueCount = bills.filter((b) => b.status === 'OVERDUE').length;
  const unpaidTotal = bills
    .filter((b) => b.status !== 'PAID')
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <PageContainer title="Bill Reminders">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Bill Reminders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay ahead of utilities, rent, credit card statements, and loan EMIs.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Add Bill Reminder
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pending Bills Total
          </span>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
            {formatCurrency(unpaidTotal)}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            Across {bills.filter((b) => b.status !== 'PAID').length} unpaid bills
          </span>
        </div>

        <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Due Soon (≤ 3 Days)
          </span>
          <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 mt-2">
            {dueSoonCount}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            Requires immediate payment
          </span>
        </div>

        <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Overdue
          </span>
          <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 mt-2">
            {overdueCount}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            Missed due dates
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto">
        {(['ALL', 'DUE_SOON', 'UPCOMING', 'OVERDUE', 'PAID'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab === 'ALL'
              ? `All (${bills.length})`
              : tab === 'DUE_SOON'
              ? `Due Soon (${dueSoonCount})`
              : tab === 'UPCOMING'
              ? 'Upcoming'
              : tab === 'OVERDUE'
              ? `Overdue (${overdueCount})`
              : 'Paid'}
          </button>
        ))}
      </div>

      {/* Bills Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 h-44 tw-animate-shimmer"
            />
          ))}
        </div>
      ) : filteredBills.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-10 w-10 text-muted-foreground/60" />}
          title="No Bills in this Section"
          description="Track your electricity, internet, rent, and credit card payments to avoid late fees."
          action={{
            label: 'Add Bill',
            onClick: handleOpenCreate,
          }}
        />
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBills.map((bill) => {
            const isOverdue = bill.status === 'OVERDUE';
            const isDueSoon = bill.status === 'DUE_SOON';
            const isPaid = bill.status === 'PAID';

            return (
              <div
                key={bill.id}
                className={`bg-white dark:bg-[#1A2234] border ${
                  isPaid
                    ? 'border-slate-200 dark:border-slate-800 opacity-60'
                    : isOverdue
                    ? 'border-rose-400/60 dark:border-rose-500/40 ring-1 ring-rose-400/20'
                    : isDueSoon
                    ? 'border-amber-400/60 dark:border-amber-500/40 ring-1 ring-amber-400/20'
                    : 'border-slate-200/80 dark:border-slate-800/80'
                } rounded-xl p-5 shadow-xs flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isPaid
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : isOverdue
                            ? 'bg-rose-500/10 text-rose-600'
                            : isDueSoon
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-blue-500/10 text-blue-600'
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {bill.title}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {bill.frequency.toLowerCase()}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        isPaid
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : isOverdue
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : isDueSoon
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isPaid ? 'PAID' : isOverdue ? 'OVERDUE' : isDueSoon ? 'DUE SOON' : 'UPCOMING'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Bill Amount
                      </span>
                      <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {formatCurrency(bill.amount)}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Due Date
                      </span>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-1 justify-end">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {bill.dueDate}
                      </div>
                      {!isPaid && (
                        <span
                          className={`text-[11px] block mt-0.5 font-medium ${
                            isOverdue
                              ? 'text-rose-600 dark:text-rose-400 font-bold'
                              : isDueSoon
                              ? 'text-amber-600 dark:text-amber-400 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {bill.daysUntilDue < 0
                            ? `${Math.abs(bill.daysUntilDue)}d overdue`
                            : bill.daysUntilDue === 0
                            ? 'Due today'
                            : `Due in ${bill.daysUntilDue}d`}
                        </span>
                      )}
                    </div>
                  </div>

                  {(bill.account || bill.category) && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      {bill.account && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">
                          {bill.account.name}
                        </span>
                      )}
                      {bill.category && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">
                          {bill.category.name}
                        </span>
                      )}
                    </div>
                  )}

                  {bill.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
                      {bill.notes}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                  <div>
                    {!isPaid ? (
                      <button
                        type="button"
                        onClick={() => handleMarkPaid(bill)}
                        className="px-2.5 py-1 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 font-medium transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Mark Paid
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Paid
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(bill)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(bill.id)}
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
        title={editingBill ? 'Edit Bill Reminder' : 'Add Bill Reminder'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Bill Title"
            placeholder="e.g. Electricity Bill, Jio Fiber, House Rent, Credit Card"
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
                <option value="YEARLY">Yearly</option>
                <option value="WEEKLY">Weekly</option>
                <option value="DAILY">Daily</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />

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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Consumer number, bill link, or payment details"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1A2234] text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={saving}>
              {editingBill ? 'Save Changes' : 'Add Bill Reminder'}
            </Button>

          </div>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default BillsPage;
