import React from 'react';
import { Calculator, X, Sparkles } from 'lucide-react';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorKeypad from './CalculatorKeypad';
import type { UseCalculatorReturn } from '@/hooks/useCalculator';

export interface CalculatorDialogProps {
  calculator: UseCalculatorReturn;
}

export const CalculatorDialog: React.FC<CalculatorDialogProps> = ({ calculator }) => {
  if (!calculator.isOpen) return null;

  return (
    <div
      id="trackwise-calculator-widget"
      role="dialog"
      aria-label="Quick Calculator"
      className="fixed z-50 inset-x-0 bottom-0 sm:bottom-20 sm:right-6 sm:left-auto sm:w-[370px] transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="bg-card/95 backdrop-blur-xl border border-border/80 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-black/20 p-4 sm:p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                Quick Calculator
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500/20" />
              </h2>
              <p className="text-[10px] text-muted-foreground">TrackWise Expense Math</p>
            </div>
          </div>
          <button
            type="button"
            onClick={calculator.closeCalculator}
            aria-label="Close calculator"
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display Area */}
        <CalculatorDisplay
          expression={calculator.expression}
          result={calculator.result}
          history={calculator.history}
          onSelectHistoryItem={(item) => {
            calculator.setExpression(item.result);
          }}
          onClearHistory={calculator.clearHistory}
        />

        {/* Keypad Grid */}
        <CalculatorKeypad
          onAppendToken={calculator.appendToken}
          onClear={calculator.clearExpression}
          onBackspace={calculator.backspace}
          onToggleSign={calculator.toggleSign}
          onCalculate={calculator.calculate}
          onUseResult={calculator.useResult}
        />
      </div>
    </div>
  );
};

export default React.memo(CalculatorDialog);
