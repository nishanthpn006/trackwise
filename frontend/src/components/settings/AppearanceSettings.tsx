import React from 'react';
import type { ThemeMode } from '@/types/settings';
import { Sun, Moon, Laptop, Check } from 'lucide-react';

interface AppearanceSettingsProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  isSaving: boolean;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  currentTheme,
  onThemeChange,
  isSaving,
}) => {
  const options: { mode: ThemeMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { mode: 'light', label: 'Light Mode', icon: Sun },
    { mode: 'dark', label: 'Dark Mode', icon: Moon },
    { mode: 'system', label: 'System Preference', icon: Laptop },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-base font-bold text-foreground">Appearance & Theme</h3>
        <p className="text-xs text-muted-foreground">Customize how TrackWise looks on your device.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = currentTheme === opt.mode;
          return (
            <button
              key={opt.mode}
              type="button"
              onClick={() => onThemeChange(opt.mode)}
              disabled={isSaving}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all relative ${
                isSelected
                  ? 'border-primary bg-primary/5 text-primary shadow-xs'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 p-1 rounded-full bg-primary text-primary-foreground">
                  <Check className="w-3 h-3" />
                </div>
              )}
              <Icon className="w-8 h-8 mb-3" />
              <span className="text-xs font-bold">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AppearanceSettings;
