import React from 'react';
import { Check } from 'lucide-react';

export interface ColorPickerProps {
  value: string;
  onChange: (colorHex: string) => void;
  disabled?: boolean;
}

const PREDEFINED_COLORS = [
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Orange', hex: '#F59E0B' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Gray', hex: '#64748B' },
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Emerald', hex: '#059669' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">Color Palette</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">Custom:</span>
          <input
            type="color"
            value={value || '#3B82F6'}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            aria-label="Custom color picker"
            className="w-7 h-7 rounded-lg bg-background border border-input p-0.5 cursor-pointer disabled:opacity-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
        {PREDEFINED_COLORS.map((c) => {
          const isSelected = value.toLowerCase() === c.hex.toLowerCase();
          return (
            <button
              key={c.hex}
              type="button"
              disabled={disabled}
              onClick={() => onChange(c.hex)}
              title={c.name}
              className={`h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 ${
                isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-xs' : 'opacity-90 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {isSelected && <Check className="h-4 w-4 text-white drop-shadow-sm" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPicker;
