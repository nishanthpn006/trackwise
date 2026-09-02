import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Plus,
  Calendar,
  Pause,
  Play,
  Trash2,
  Edit2,
} from 'lucide-react';

import PageContainer from '@/components/common/PageContainer';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Dialog from '@/components/ui/Dialog';
import { useToast } from '@/hooks/useToast';
import subscriptionService from '@/services/subscriptionService';
import accountService from '@/services/accountService';
import categoryService from '@/services/categoryService';
import type {
  Subscription,
  SubscriptionRequest,
  SubscriptionSummary,
  BillingCycle,
  SubscriptionStatus,
} from '@/types/subscription';
import type { Account } from '@/types/account';
import type { Category } from '@/types/category';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const SubscriptionsPage: React.FC = () => {
  const toast = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [summary, setSummary] = useState<SubscriptionSummary | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  const [formData, setFormData] = useState<SubscriptionRequest>({
    name: '',
    amount: 0,
    billingCycle: 'MONTHLY',
    nextBillingDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    reminderDaysBefore: 3,
    description: '',
    categoryId: '',
    accountId: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [subs, summ, accs, cats] = await Promise.all([
        subscriptionService.getSubscriptions(),
        subscriptionService.getSummary(),
        accountService.getAccounts(),
        categoryService.getCategories(),
      ]);
      setSubscriptions(subs);
      setSummary(summ);
      setAccounts(accs);
      setCategories(cats);
    } catch {
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditingSub(null);
    setFormData({
      name: '',
      amount: 0,
      billingCycle: 'MONTHLY',
      nextBillingDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      reminderDaysBefore: 3,
      description: '',
      categoryId: categories[0]?.id || '',
      accountId: accounts[0]?.id || '',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (sub: Subscription) => {
    setEditingSub(sub);
    setFormData({
      name: sub.name,
      amount: sub.amount,
      billingCycle: sub.billingCycle,
      nextBillingDate: sub.nextBillingDate,
      status: sub.status,
      reminderDaysBefore: sub.reminderDaysBefore || 3,
      description: sub.description || '',
      categoryId: sub.category?.id || '',
      accountId: sub.account?.id || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.amount <= 0) {
      toast.warning('Please enter a valid subscription name and amount');
      return;
    }

    try {
      setSaving(true);
      if (editingSub) {
        await subscriptionService.updateSubscription(editingSub.id, formData);
        toast.success('Subscription updated');
      } else {
        await subscriptionService.createSubscription(formData);
        toast.success('Subscription added');
      }
      setDialogOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to save subscription');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: SubscriptionStatus) => {
    try {
      await subscriptionService.updateStatus(id, status);
      toast.success(`Subscription marked as ${status.toLowerCase()}`);
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this subscription?')) return;
    try {
      await subscriptionService.deleteSubscription(id);
      toast.success('Subscription deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete subscription');
    }
  };

  return (
    <PageContainer title="Subscriptions">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Subscription Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track streaming, SaaS, memberships, and recurring digital charges.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Add Subscription
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Monthly Spend
          </span>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
            {formatCurrency(summary?.monthlyTotal || 0)}
            <span className="text-xs font-normal text-slate-400 ml-1">/ mo</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            Normalized monthly burn rate
          </span>
        </div>

        <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Yearly Projection
          </span>
          <div className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 mt-2">
            {formatCurrency(summary?.yearlyTotal || 0)}
            <span className="text-xs font-normal text-slate-400 ml-1">/ yr</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            Annual recurring cost
          </span>
        </div>

        <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Subscriptions
          </span>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
            {summary?.activeCount || 0}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            {subscriptions.filter((s) => s.status === 'PAUSED').length} paused
          </span>
        </div>
      </div>

      {/* Subscriptions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 h-44 tw-animate-shimmer"
            />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="h-10 w-10 text-muted-foreground/60" />}
          title="No Subscriptions Tracked"
          description="Add your Netflix, Spotify, gym, or software subscriptions to track recurring expenses."
          action={{
            label: 'Add Subscription',
            onClick: handleOpenCreate,
          }}
        />
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map((sub) => {
            const isDueSoon = sub.daysUntilBilling >= 0 && sub.daysUntilBilling <= 3;
            return (
              <div
                key={sub.id}
                className={`bg-white dark:bg-[#1A2234] border ${
                  sub.status === 'CANCELLED'
                    ? 'border-slate-200 dark:border-slate-800 opacity-50'
                    : isDueSoon
                    ? 'border-amber-400/60 dark:border-amber-500/40 ring-1 ring-amber-400/20'
                    : 'border-slate-200/80 dark:border-slate-800/80'
                } rounded-xl p-5 shadow-xs flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                        {sub.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {sub.name}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {sub.billingCycle.toLowerCase()}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        sub.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : sub.status === 'PAUSED'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Amount
                      </span>
                      <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        {formatCurrency(sub.amount)}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Next Bill
                      </span>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-1 justify-end">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {sub.nextBillingDate}
                      </div>
                      {sub.status === 'ACTIVE' && (
                        <span
                          className={`text-[11px] block mt-0.5 ${
                            isDueSoon
                              ? 'text-amber-600 dark:text-amber-400 font-semibold'
                              : 'text-slate-400'
                          }`}
                        >
                          {sub.daysUntilBilling < 0
                            ? 'Overdue'
                            : sub.daysUntilBilling === 0
                            ? 'Due today'
                            : `Due in ${sub.daysUntilBilling}d`}
                        </span>
                      )}
                    </div>
                  </div>

                  {(sub.account || sub.category) && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      {sub.account && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">
                          {sub.account.name}
                        </span>
                      )}
                      {sub.category && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80">
                          {sub.category.name}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {sub.status === 'ACTIVE' ? (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(sub.id, 'PAUSED')}
                        className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1"
                      >
                        <Pause className="w-3 h-3" /> Pause
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(sub.id, 'ACTIVE')}
                        className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" /> Resume
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(sub)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(sub.id)}
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
        title={editingSub ? 'Edit Subscription' : 'Add Subscription'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Service Name"
            placeholder="e.g. Netflix, Spotify, Google One, Gym"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                Billing Cycle
              </label>
              <select
                value={formData.billingCycle}
                onChange={(e) =>
                  setFormData({ ...formData, billingCycle: e.target.value as BillingCycle })
                }
                className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1A2234] text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
                <option value="WEEKLY">Weekly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Next Billing Date"
              type="date"
              value={formData.nextBillingDate}
              onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={saving}>
              {editingSub ? 'Save Changes' : 'Add Subscription'}
            </Button>

          </div>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default SubscriptionsPage;
