import React from 'react';
import { formatDisplayResult, type CalculationHistoryItem } from '@/utils/calculatorEngine';
import { Clock, History } from 'lucide-react';

export interface CalculatorDisplayProps {
  expression: string;
  result: string;
  history: CalculationHistoryItem[];
  onSelectHistoryItem: (item: CalculationHistoryItem) => void;
  onClearHistory: () => void;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  result,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  const [showHistory, setShowHistory] = React.useState(false);

  return (
    <div className="bg-muted/40 dark:bg-muted/20 border border-border/60 rounded-2xl p-3.5 space-y-2 relative transition-all">
      {/* Top Header Row: History toggle button */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground border-b border-border/40 pb-1.5">
        <div className="flex items-center gap-1 font-semibold uppercase tracking-wider text-[10px]">
          <Clock className="w-3 h-3 text-primary" />
          <span>Quick Calculator</span>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              title="Calculation History"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline cursor-pointer"
            >
              <History className="w-3 h-3" />
              <span>{showHistory ? 'Close History' : `History (${history.length})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* History Drawer Dropdown */}
      {showHistory && history.length > 0 ? (
        <div className="max-h-40 overflow-y-auto space-y-1.5 text-xs py-1 divide-y divide-border/30">
          <div className="flex justify-between items-center text-[10px] text-muted-foreground pb-1">
            <span className="font-bold uppercase">Recent Calculations</span>
            <button
              type="button"
              onClick={onClearHistory}
              className="text-rose-500 hover:underline cursor-pointer"
            >
              Clear
            </button>
          </div>
          {history.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectHistoryItem(item);
                setShowHistory(false);
              }}
              className="w-full text-left pt-1 hover:bg-muted/50 p-1 rounded-lg transition-colors flex justify-between items-baseline"
            >
              <span className="text-muted-foreground font-mono text-[11px] truncate max-w-[180px]">
                {item.expression}
              </span>
              <span className="font-bold text-foreground font-mono text-xs">
                = {formatDisplayResult(item.result)}
              </span>
            </button>
          ))}
        </div>
      ) : (
        /* Expression & Result Display */
        <div className="space-y-1 text-right min-h-[64px] flex flex-col justify-end">
          {/* Expression Line */}
          <div className="text-xs font-mono text-muted-foreground truncate h-5 tracking-wide">
            {expression || '0'}
          </div>

          {/* Large Result Line */}
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono truncate">
            ₹{formatDisplayResult(result)}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CalculatorDisplay);
