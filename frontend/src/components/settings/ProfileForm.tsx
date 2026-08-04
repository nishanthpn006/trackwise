import React, { useState, useEffect } from 'react';
import type { UserProfileData, UpdateProfilePayload } from '@/types/settings';
import { User, Mail, Phone, Globe, Clock, Check, Loader2 } from 'lucide-react';

interface ProfileFormProps {
  profile: UserProfileData | null;
  onSave: (payload: UpdateProfilePayload) => Promise<void>;
  isSaving: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSave, isSaving }) => {
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [timezone, setTimezone] = useState<string>('UTC');
  const [bio, setBio] = useState<string>('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhone(profile.phone || '');
      setCurrency(profile.currency || 'USD');
      setTimezone(profile.timezone || 'UTC');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    await onSave({
      fullName: fullName.trim(),
      phone: phone.trim(),
      currency,
      timezone,
      bio: bio.trim(),
    });
  };

  if (!profile) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-base font-bold text-foreground">Profile Information</h3>
        <p className="text-xs text-muted-foreground">Update your personal details and public profile information.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="settings-fullname" className="block text-xs font-bold text-foreground">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              id="settings-fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isSaving}
              placeholder="e.g. John Doe"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary disabled:opacity-50"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="settings-email" className="block text-xs font-bold text-foreground">
            Email Address <span className="text-muted-foreground font-normal">(Read-only)</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              id="settings-email"
              type="email"
              value={profile.email}
              disabled
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-muted/40 text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="settings-phone" className="block text-xs font-bold text-foreground">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              id="settings-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSaving}
              placeholder="+1 (555) 000-0000"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="settings-currency" className="block text-xs font-bold text-foreground">
            Primary Currency
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <select
              id="settings-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={isSaving}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="CAD">CAD ($) - Canadian Dollar</option>
              <option value="AUD">AUD ($) - Australian Dollar</option>
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="JPY">JPY (¥) - Japanese Yen</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="settings-timezone" className="block text-xs font-bold text-foreground">
            Timezone
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <select
              id="settings-timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              disabled={isSaving}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="America/New_York">America/New_York (EST/EDT)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>

              <option value="Europe/London">Europe/London (GMT/BST)</option>
              <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="settings-bio" className="block text-xs font-bold text-foreground">
            Bio
          </label>
          <textarea
            id="settings-bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={isSaving}
            placeholder="Tell us a bit about yourself..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <button
          type="submit"
          disabled={isSaving || !fullName.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all shadow-xs disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>{isSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
