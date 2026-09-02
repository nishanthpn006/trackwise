import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Wallet, ArrowRight, Landmark, CreditCard, Banknote, Smartphone } from 'lucide-react';
import accountService from '@/services/accountService';
import type { Account, AccountType } from '@/types/account';

const TYPE_ICONS: Record<AccountType, React.ElementType> = {
  BANK: Landmark,
  CASH: Banknote,
  WALLET: Wallet,
  CREDIT_CARD: CreditCard,
  UPI: Smartphone,
  SAVINGS: Landmark,
  INVESTMENT: Landmark,
};

const formatCurrency = (amount: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface AccountsSummaryWidgetProps {
  refreshKey?: number;
}

export const AccountsSummaryWidget: React.FC<AccountsSummaryWidgetProps> = ({ refreshKey = 0 }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    accountService
      .getAccounts()
      .then((data) => {
        if (isMounted) {
          setAccounts(data.slice(0, 4));
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded tw-animate-shimmer mb-4" />
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-lg tw-animate-shimmer" />
          <div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-lg tw-animate-shimmer" />
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Accounts & Balances
          </h3>
        </div>
        <Link
          to="/accounts"
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {accounts.map((acc) => {
          const Icon = TYPE_ICONS[acc.type] || Wallet;
          return (
            <div
              key={acc.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-white dark:bg-[#1A2234] border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {acc.name}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">{acc.type.toLowerCase()}</div>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(acc.currentBalance ?? acc.initialBalance, acc.currency)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountsSummaryWidget;
