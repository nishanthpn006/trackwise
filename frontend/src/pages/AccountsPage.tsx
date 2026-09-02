import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet,
  Plus,
  Landmark,
  CreditCard,
  Banknote,
  Smartphone,
  TrendingUp,
  PiggyBank,
  Archive,
  ArchiveRestore,
  Trash2,
  Edit2,
} from 'lucide-react';

import PageContainer from '@/components/common/PageContainer';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Dialog from '@/components/ui/Dialog';
import { useToast } from '@/hooks/useToast';
import accountService from '@/services/accountService';
import type { Account, AccountType, AccountRequest } from '@/types/account';


const ACCOUNT_TYPE_CONFIG: Record<
  AccountType,
  { label: string; icon: React.ElementType; color: string }
> = {
  BANK: { label: 'Bank Account', icon: Landmark, color: 'text-blue-500 bg-blue-500/10 dark:bg-blue-500/20' },
  CASH: { label: 'Cash', icon: Banknote, color: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20' },
  WALLET: { label: 'Digital Wallet', icon: Wallet, color: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/20' },
  CREDIT_CARD: { label: 'Credit Card', icon: CreditCard, color: 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/20' },
  UPI: { label: 'UPI', icon: Smartphone, color: 'text-purple-500 bg-purple-500/10 dark:bg-purple-500/20' },
  SAVINGS: { label: 'Savings', icon: PiggyBank, color: 'text-teal-500 bg-teal-500/10 dark:bg-teal-500/20' },
  INVESTMENT: { label: 'Investment', icon: TrendingUp, color: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20' },
};

const formatCurrency = (amount: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const AccountsPage: React.FC = () => {
  const toast = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [formData, setFormData] = useState<AccountRequest>({
    name: '',
    type: 'BANK',
    initialBalance: 0,
    currency: 'INR',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await accountService.getAccounts(includeArchived);
      setAccounts(data);
    } catch {
      toast.error('Failed to load financial accounts');
    } finally {
      setLoading(false);
    }
  }, [includeArchived, toast]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleOpenCreate = () => {
    setEditingAccount(null);
    setFormData({
      name: '',
      type: 'BANK',
      initialBalance: 0,
      currency: 'INR',
      description: '',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (acc: Account) => {
    setEditingAccount(acc);
    setFormData({
      name: acc.name,
      type: acc.type,
      initialBalance: acc.initialBalance,
      currency: acc.currency,
      description: acc.description || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning('Account name is required');
      return;
    }

    try {
      setSaving(true);
      if (editingAccount) {
        await accountService.updateAccount(editingAccount.id, formData);
        toast.success('Account updated successfully');
      } else {
        await accountService.createAccount(formData);
        toast.success('Account created successfully');
      }
      setDialogOpen(false);
      fetchAccounts();
    } catch {
      toast.error('Failed to save account');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleArchive = async (acc: Account) => {
    try {
      await accountService.toggleArchive(acc.id);
      toast.success(
        acc.isArchived ? 'Account restored to active' : 'Account moved to archive'
      );
      fetchAccounts();
    } catch {
      toast.error('Failed to update account archive status');
    }
  };

  const handleDelete = async (acc: Account) => {
    if (!window.confirm(`Are you sure you want to delete or archive "${acc.name}"?`)) return;
    try {
      await accountService.deleteAccount(acc.id);
      toast.success('Account safely removed/archived');
      fetchAccounts();
    } catch {
      toast.error('Failed to delete account');
    }
  };


  const totalAssets = accounts
    .filter((a) => !a.isArchived && a.type !== 'CREDIT_CARD')
    .reduce((sum, a) => sum + (a.currentBalance || 0), 0);

  const totalLiabilities = accounts
    .filter((a) => !a.isArchived && a.type === 'CREDIT_CARD')
    .reduce((sum, a) => sum + (a.currentBalance || 0), 0);

  const netWorth = totalAssets - totalLiabilities;

  return (
    <PageContainer title="Financial Accounts">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Accounts & Ledgers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your bank accounts, digital wallets, cards, and liquid assets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeArchived}
              onChange={(e) => setIncludeArchived(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Show Archived
          </label>
          <Button variant="primary" size="md" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" />
            New Account
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Net Balance
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
            {formatCurrency(netWorth)}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            Across {accounts.filter((a) => !a.isArchived).length} active accounts
          </span>
        </div>

        <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Assets
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-2">
            {formatCurrency(totalAssets)}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            Cash, Savings & Bank Balances
          </span>
        </div>

        <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Credit & Liabilities
            </span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 mt-2">
            {formatCurrency(totalLiabilities)}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            Outstanding Credit Card balances
          </span>
        </div>
      </div>

      {/* Account Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 h-44 tw-animate-shimmer"
            />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <EmptyState
          icon={<Wallet className="h-10 w-10 text-muted-foreground/60" />}
          title="No Financial Accounts"
          description="Create your first financial account to start organizing transactions across cash, cards, and bank ledgers."
          action={{
            label: 'Add Account',
            onClick: handleOpenCreate,
          }}
        />
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => {
            const config = ACCOUNT_TYPE_CONFIG[acc.type] || ACCOUNT_TYPE_CONFIG.BANK;
            const Icon = config.icon;

            return (
              <div
                key={acc.id}
                className={`bg-white dark:bg-[#1A2234] border ${
                  acc.isArchived
                    ? 'border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                    : 'border-slate-200/80 dark:border-slate-800/80'
                } rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${config.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                          {acc.name}
                          {acc.isArchived && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                              Archived
                            </span>
                          )}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{config.label}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Current Balance
                    </span>
                    <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
                      {formatCurrency(acc.currentBalance ?? acc.initialBalance, acc.currency)}
                    </div>
                  </div>

                  {acc.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                      {acc.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <span>{acc.transactionCount ?? 0} transactions</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(acc)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                      title="Edit Account"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleArchive(acc)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                      title={acc.isArchived ? 'Restore Account' : 'Archive Account'}
                    >
                      {acc.isArchived ? (
                        <ArchiveRestore className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <Archive className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(acc)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 transition-colors"
                      title="Delete Account"
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

      {/* Create / Edit Dialog */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingAccount ? 'Edit Account' : 'Create New Account'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Account Name"
            placeholder="e.g. HDFC Salary, Main Cash, PayTM Wallet"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Account Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as AccountType })}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1A2234] text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="BANK">Bank Account</option>
              <option value="CASH">Cash</option>
              <option value="WALLET">Digital Wallet</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="UPI">UPI</option>
              <option value="SAVINGS">Savings Account</option>
              <option value="INVESTMENT">Investment Account</option>
            </select>
          </div>

          <Input
            label="Initial Balance (₹)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.initialBalance || ''}
            onChange={(e) =>
              setFormData({ ...formData, initialBalance: parseFloat(e.target.value) || 0 })
            }
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Notes regarding account purpose, account numbers, etc."
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
              {editingAccount ? 'Save Changes' : 'Create Account'}
            </Button>

          </div>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default AccountsPage;
