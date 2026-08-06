import React, { useState, useEffect } from 'react';
import type { UserPreferences } from '@/types/settings';
import { Sliders, Check, Loader2 } from 'lucide-react';

interface PreferenceSettingsProps {
  preferences: UserPreferences | undefined;
  onSave: (preferences: Partial<UserPreferences>) => Promise<void>;
  isSaving: boolean;
}

export const PreferenceSettings: React.FC<PreferenceSettingsProps> = ({
  preferences,
  onSave,
  isSaving,
}) => {
  const [currency, setCurrency] = useState<string>('INR');
  const [dateFormat, setDateFormat] = useState<string>('YYYY-MM-DD');
  const [timeFormat, setTimeFormat] = useState<string>('24h');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<string>('Monday');
  const [numberFormat, setNumberFormat] = useState<string>('en-IN');
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    if (preferences) {
      setCurrency(preferences.currency || 'INR');
      setDateFormat(preferences.dateFormat || 'YYYY-MM-DD');
      setTimeFormat(preferences.timeFormat || '24h');
      setFirstDayOfWeek(preferences.firstDayOfWeek || 'Monday');
      setNumberFormat(preferences.numberFormat || 'en-IN');
      setLanguage(preferences.language || 'en');
    }
  }, [preferences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      currency,
      dateFormat,
      timeFormat,
      firstDayOfWeek,
      numberFormat,
      language,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Localization & Regional Preferences</h3>
          <p className="text-xs text-muted-foreground">Configure date, currency, number formats, and regional standards.</p>
        </div>
        <Sliders className="w-5 h-5 text-primary" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="pref-currency" className="block text-xs font-bold text-foreground">
            Default Currency
          </label>
          <select
            id="pref-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={isSaving}
            className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
          >
            <option value="USD">USD ($) - US Dollar</option>
            <option value="EUR">EUR (€) - Euro</option>
            <option value="GBP">GBP (£) - British Pound</option>
            <option value="CAD">CAD ($) - Canadian Dollar</option>
            <option value="INR">INR (₹) - Indian Rupee</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pref-dateformat" className="block text-xs font-bold text-foreground">
            Date Format
          </label>
          <select
            id="pref-dateformat"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            disabled={isSaving}
            className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD (2026-08-04)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (08/04/2026)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (04/08/2026)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pref-timeformat" className="block text-xs font-bold text-foreground">
            Time Format
          </label>
          <select
            id="pref-timeformat"
            value={timeFormat}
            onChange={(e) => setTimeFormat(e.target.value)}
            disabled={isSaving}
            className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
          >
            <option value="24h">24-hour (14:30)</option>
            <option value="12h">12-hour (02:30 PM)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pref-firstday" className="block text-xs font-bold text-foreground">
            First Day of Week
          </label>
          <select
            id="pref-firstday"
            value={firstDayOfWeek}
            onChange={(e) => setFirstDayOfWeek(e.target.value)}
            disabled={isSaving}
            className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
          >
            <option value="Monday">Monday</option>
            <option value="Sunday">Sunday</option>
            <option value="Saturday">Saturday</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pref-numformat" className="block text-xs font-bold text-foreground">
            Number Format
          </label>
          <select
            id="pref-numformat"
            value={numberFormat}
            onChange={(e) => setNumberFormat(e.target.value)}
            disabled={isSaving}
            className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
          >
            <option value="en-US">1,234,567.89 (Standard US)</option>
            <option value="de-DE">1.234.567,89 (European)</option>
            <option value="en-IN">12,34,567.89 (Indian Lakhs)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pref-language" className="block text-xs font-bold text-foreground">
            System Language
          </label>
          <select
            id="pref-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isSaving}
            className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
          >
            <option value="en">English (US)</option>
            <option value="es">Español (Coming soon)</option>
            <option value="fr">Français (Coming soon)</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all shadow-xs disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>{isSaving ? 'Saving Preferences...' : 'Save Preferences'}</span>
        </button>
      </div>
    </form>
  );
};

export default PreferenceSettings;
