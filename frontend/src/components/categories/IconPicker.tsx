import React, { useState } from 'react';
import { CategoryIcon } from './CategoryIcon';
import Dialog from '@/components/ui/Dialog';
import { Check, Grid } from 'lucide-react';

export interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  color?: string;
  disabled?: boolean;
}

const AVAILABLE_ICONS = [
  { name: 'wallet', label: 'Wallet' },
  { name: 'shopping-cart', label: 'Shopping Cart' },
  { name: 'car', label: 'Car' },
  { name: 'home', label: 'Home' },
  { name: 'coffee', label: 'Coffee' },
  { name: 'utensils', label: 'Utensils' },
  { name: 'gift', label: 'Gift' },
  { name: 'gamepad', label: 'Gamepad' },
  { name: 'book', label: 'Book' },
  { name: 'laptop', label: 'Laptop' },
  { name: 'plane', label: 'Plane' },
  { name: 'heart', label: 'Health / Heart' },
  { name: 'briefcase', label: 'Work / Briefcase' },
  { name: 'credit-card', label: 'Credit Card' },
  { name: 'piggy-bank', label: 'Piggy Bank' },
  { name: 'users', label: 'Family / Users' },
  { name: 'graduation-cap', label: 'Education' },
  { name: 'fuel', label: 'Fuel / Gas' },
  { name: 'hospital', label: 'Medical' },
  { name: 'shopping-bag', label: 'Shopping Bag' },
  { name: 'film', label: 'Entertainment' },
  { name: 'trending-up', label: 'Investments' },
  { name: 'wrench', label: 'Services' },
  { name: 'zap', label: 'Utilities' },
  { name: 'music', label: 'Music' },
  { name: 'shield', label: 'Insurance' },
  { name: 'tv', label: 'Subscriptions' },
  { name: 'dollar-sign', label: 'Income / Cash' },
  { name: 'tag', label: 'General Tag' },
];

export const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  color = '#3B82F6',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const selectedIconObj = AVAILABLE_ICONS.find((i) => i.name === value) || AVAILABLE_ICONS[0];

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
  };

  return (
    <div>
      {/* Trigger Button & Preview */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-2 rounded-xl bg-background border border-input text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50 text-xs"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="p-2 rounded-lg flex items-center justify-center transition-colors"
            style={{
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            <CategoryIcon name={value} className="h-4 w-4" />
          </div>
          <span className="font-semibold text-xs text-foreground capitalize">
            {selectedIconObj.label}
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <Grid className="h-3.5 w-3.5" />
          <span>Choose Icon</span>
        </div>
      </button>

      {/* Icon Selector Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Select Category Icon"
        description="Choose a visually distinct icon for your category label."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5 max-h-72 overflow-y-auto p-1 pr-2">
            {AVAILABLE_ICONS.map((icon) => {
              const isSelected = value === icon.name;
              return (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => handleSelect(icon.name)}
                  title={icon.label}
                  className={`group relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30'
                      : 'border-border/60 bg-card hover:bg-muted/50 hover:border-border'
                  }`}
                >
                  <div
                    className="p-2 rounded-lg transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: isSelected ? `${color}30` : `${color}15`,
                      color: color,
                    }}
                  >
                    <CategoryIcon name={icon.name} className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium truncate w-full text-center mt-1">
                    {icon.name}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1 right-1 p-0.5 rounded-full bg-primary text-white">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2 border-t border-border/40">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-xl border border-border/80 text-foreground hover:bg-muted font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default IconPicker;
