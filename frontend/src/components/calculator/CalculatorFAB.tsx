import React from 'react';
import { Calculator } from 'lucide-react';

export interface CalculatorFABProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const CalculatorFAB: React.FC<CalculatorFABProps> = ({ isOpen, onToggle }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-foreground text-background text-[11px] font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap">
        Quick Calculator
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle Quick Calculator"
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl ${
          isOpen
            ? 'bg-foreground text-background scale-105 ring-4 ring-primary/30'
            : 'bg-primary text-primary-foreground hover:scale-110 active:scale-95 shadow-primary/30 hover:shadow-primary/50'
        }`}
      >
        <Calculator className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:rotate-6" />
      </button>
    </div>
  );
};

export default React.memo(CalculatorFAB);
