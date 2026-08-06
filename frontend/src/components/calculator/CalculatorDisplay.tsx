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
    <div className="bg-muted/40 dark:bg-muted/20 border border-border/60 rounded-xl p-2.5 sm:p-3 space-y-1 relative transition-all">
      {/* Top Header Row: History toggle button */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground border-b border-border/40 pb-1">
        <div className="flex items-center gap-1 font-semibold uppercase tracking-wider text-[9px]">
          <Clock className="w-2.5 h-2.5 text-primary" />
          <span>TrackWise Calculator</span>
        </div>
        <div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              title="Calculation History"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline cursor-pointer"
            >
              <History className="w-2.5 h-2.5" />
              <span>{showHistory ? 'Close' : `History (${history.length})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* History Drawer Dropdown */}
      {showHistory && history.length > 0 ? (
        <div className="max-h-36 overflow-y-auto space-y-1 text-xs py-1 divide-y divide-border/30">
          <div className="flex justify-between items-center text-[10px] text-muted-foreground pb-0.5">
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
              <span className="text-muted-foreground font-mono text-[10px] truncate max-w-[160px]">
                {item.expression}
              </span>
              <span className="font-bold text-foreground font-mono text-[11px]">
                = {formatDisplayResult(item.result)}
              </span>
            </button>
          ))}
        </div>
      ) : (
        /* Expression & Result Display */
        <div className="space-y-0.5 text-right min-h-[48px] flex flex-col justify-end">
          {/* Full Expression Line */}
          <div className="text-[11px] font-mono text-muted-foreground truncate h-4 tracking-wide">
            {expression || '0'}
          </div>

          {/* Prominent Result Line */}
          <div className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono truncate">
            ₹{formatDisplayResult(result)}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CalculatorDisplay);
