import React, { useState, useEffect } from 'react';
import type { UserNotifications } from '@/types/settings';
import { Bell, Mail, ShieldAlert, Wallet, Target, Calendar, Check, Loader2 } from 'lucide-react';

interface NotificationSettingsProps {
  notifications: UserNotifications | undefined;
  onSave: (notifications: Partial<UserNotifications>) => Promise<void>;
  isSaving: boolean;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notifications,
  onSave,
  isSaving,
}) => {
  const [budgetAlerts, setBudgetAlerts] = useState<boolean>(true);
  const [goalAlerts, setGoalAlerts] = useState<boolean>(true);
  const [monthlySummary, setMonthlySummary] = useState<boolean>(true);
  const [weeklySummary, setWeeklySummary] = useState<boolean>(false);
  const [securityAlerts, setSecurityAlerts] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(false);

  useEffect(() => {
    if (notifications) {
      setBudgetAlerts(notifications.budgetAlerts);
      setGoalAlerts(notifications.goalAlerts);
      setMonthlySummary(notifications.monthlySummary);
      setWeeklySummary(notifications.weeklySummary);
      setSecurityAlerts(notifications.securityAlerts);
      setEmailNotifications(notifications.emailNotifications);
      setPushNotifications(notifications.pushNotifications);
    }
  }, [notifications]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      budgetAlerts,
      goalAlerts,
      monthlySummary,
      weeklySummary,
      securityAlerts,
      emailNotifications,
      pushNotifications,
    });
  };

  const toggles = [
    {
      label: 'Budget Exceeded & Overspend Alerts',
      desc: 'Receive alerts when spending nears or exceeds allocated monthly category budgets.',
      icon: Wallet,
      value: budgetAlerts,
      setter: setBudgetAlerts,
    },
    {
      label: 'Savings Goal Milestones',
      desc: 'Get notified when you reach 25%, 50%, 75%, and 100% of your financial goal targets.',
      icon: Target,
      value: goalAlerts,
      setter: setGoalAlerts,
    },
    {
      label: 'Monthly Financial Summary Email',
      desc: 'Digest report summarizing total income, total expenses, and top category spending.',
      icon: Calendar,
      value: monthlySummary,
      setter: setMonthlySummary,
    },
    {
      label: 'Weekly Expenditure Insights',
      desc: 'Weekly snapshot highlighting week-over-week spending trends.',
      icon: Bell,
      value: weeklySummary,
      setter: setWeeklySummary,
    },
    {
      label: 'Security & Login Alerts',
      desc: 'Instant notifications when password is changed or new login is detected.',
      icon: ShieldAlert,
      value: securityAlerts,
      setter: setSecurityAlerts,
    },
    {
      label: 'Email Notifications',
      desc: 'Deliver system alerts and reports to your registered email address.',
      icon: Mail,
      value: emailNotifications,
      setter: setEmailNotifications,
    },
    {
      label: 'Browser Push Notifications',
      desc: 'In-app and browser popup notifications.',
      icon: Bell,
      value: pushNotifications,
      setter: setPushNotifications,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Notification Preferences</h3>
          <p className="text-xs text-muted-foreground">Manage how and when TrackWise notifies you.</p>
        </div>
        <Bell className="w-5 h-5 text-primary" />
      </div>

      <div className="space-y-4">
        {toggles.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-border/60 hover:bg-muted/20 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{item.label}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={item.value}
                  onChange={(e) => item.setter(e.target.checked)}
                  disabled={isSaving}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-muted peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all shadow-xs disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>{isSaving ? 'Saving Notification Settings...' : 'Save Notification Settings'}</span>
        </button>
      </div>
    </form>
  );
};

export default NotificationSettings;
