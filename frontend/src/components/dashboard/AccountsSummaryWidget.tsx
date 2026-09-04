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
    return (
      <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Accounts & Balances
            </h3>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          No accounts connected yet. Add your bank, cash, or card account to track real-time balances.
        </p>
        <Link
          to="/accounts"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs"
        >
          <span>Create Account</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Accounts & Balances
          </h3>
        </div>
        <Link
          to="/accounts"
          className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
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
              className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-card border border-border/60 text-muted-foreground">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">
                    {acc.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground capitalize">{acc.type.toLowerCase()}</div>
                </div>
              </div>

              <div className="text-xs font-bold font-mono text-foreground">
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
