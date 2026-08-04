import React from 'react';
import type { UserProfileData } from '@/types/settings';
import { ShieldCheck, Key, Clock, Laptop, Lock } from 'lucide-react';

interface SecurityPanelProps {
  profile: UserProfileData | null;
  onChangePasswordClick: () => void;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({
  profile,
  onChangePasswordClick,
}) => {
  if (!profile) return null;

  const formatDate = (dStr?: string) => {
    if (!dStr) return 'Never / Not recorded';
    try {
      return new Date(dStr).toLocaleString();
    } catch {
      return dStr;
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Security & Active Sessions</h3>
          <p className="text-xs text-muted-foreground">Manage your authentication credentials, password security, and active sessions.</p>
        </div>
        <ShieldCheck className="w-5 h-5 text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Key className="w-4 h-4 text-primary" />
            <span>Password Security</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Password Last Changed: <span className="font-semibold text-foreground">{formatDate(profile.passwordChangedAt)}</span>
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onChangePasswordClick}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Account Timestamps</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>
              Account Created: <span className="font-semibold text-foreground">{formatDate(profile.createdAt)}</span>
            </div>
            <div>
              Last Authenticated: <span className="font-semibold text-foreground">{formatDate(profile.lastLoginAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Laptop className="w-4 h-4 text-emerald-500" />
            <span>Current Active Session</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
            Active Now
          </span>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            Session Token: <span className="font-mono text-foreground text-[11px]">JWT Bearer (24-hour expiration)</span>
          </div>
          <div>
            Device & Browser: <span className="text-foreground font-medium">{navigator.userAgent.slice(0, 60)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPanel;
