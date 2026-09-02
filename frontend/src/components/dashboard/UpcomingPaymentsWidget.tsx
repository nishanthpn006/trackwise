import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { CalendarClock, ArrowRight, Zap, Sparkles } from 'lucide-react';
import billService from '@/services/billService';
import subscriptionService from '@/services/subscriptionService';


const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

interface UpcomingPaymentItem {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  daysUntil: number;
  type: 'BILL' | 'SUBSCRIPTION';
}

interface UpcomingPaymentsWidgetProps {
  refreshKey?: number;
}

export const UpcomingPaymentsWidget: React.FC<UpcomingPaymentsWidgetProps> = ({ refreshKey = 0 }) => {
  const [items, setItems] = useState<UpcomingPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      billService.getBillReminders(),
      subscriptionService.getSubscriptions('ACTIVE'),
    ])
      .then(([bills, subs]) => {
        if (!isMounted) return;

        const unpaidBills: UpcomingPaymentItem[] = bills
          .filter((b) => b.status !== 'PAID')
          .map((b) => ({
            id: b.id,
            title: b.title,
            amount: b.amount,
            dueDate: b.dueDate,
            daysUntil: b.daysUntilDue,
            type: 'BILL',
          }));

        const upcomingSubs: UpcomingPaymentItem[] = subs.map((s) => ({
          id: s.id,
          title: s.name,
          amount: s.amount,
          dueDate: s.nextBillingDate,
          daysUntil: s.daysUntilBilling,
          type: 'SUBSCRIPTION',
        }));

        const merged = [...unpaidBills, ...upcomingSubs]
          .sort((a, b) => a.daysUntil - b.daysUntil)
          .slice(0, 4);

        setItems(merged);
        setLoading(false);
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

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#1A2234] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Upcoming Payments
          </h3>
        </div>
        <Link
          to="/bills"
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View bills <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => {
          const isOverdue = item.daysUntil < 0;
          const isDueSoon = item.daysUntil >= 0 && item.daysUntil <= 3;

          return (
            <div
              key={`${item.type}-${item.id}`}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                isOverdue
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                  : isDueSoon
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-1.5 rounded-md ${
                    item.type === 'BILL'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-indigo-500/10 text-indigo-600'
                  }`}
                >
                  {item.type === 'BILL' ? (
                    <Zap className="w-3.5 h-3.5" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {item.type === 'BILL' ? 'Bill due' : 'Subscription renews'}{' '}
                    <span
                      className={`font-semibold ${
                        isOverdue
                          ? 'text-rose-600 dark:text-rose-400'
                          : isDueSoon
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-500'
                      }`}
                    >
                      ({item.daysUntil < 0
                        ? `${Math.abs(item.daysUntil)}d overdue`
                        : item.daysUntil === 0
                        ? 'today'
                        : `in ${item.daysUntil}d`})
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(item.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingPaymentsWidget;
