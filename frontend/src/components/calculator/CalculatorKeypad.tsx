import React from 'react';
import CalculatorButton from './CalculatorButton';
import { Copy, Delete, RotateCcw } from 'lucide-react';

export interface CalculatorKeypadProps {
  onAppendToken: (token: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onCalculate: () => void;
  onUseResult: () => void;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onAppendToken,
  onClear,
  onBackspace,
  onToggleSign,
  onCalculate,
  onUseResult,
}) => {
  return (
    <div className="space-y-3">
      {/* Keypad Grid (4 columns × 5 rows) */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <CalculatorButton
          label="AC"
          variant="action"
          onClick={onClear}
          ariaLabel="Clear expression"
          className="text-rose-500 hover:text-rose-600 dark:text-rose-400"
        />
        <CalculatorButton
          label={<Delete className="w-4 h-4" />}
          variant="action"
          onClick={onBackspace}
          ariaLabel="Backspace"
        />
        <CalculatorButton
          label="%"
          variant="operator"
          onClick={() => onAppendToken('%')}
          ariaLabel="Percentage"
        />
        <CalculatorButton
          label="÷"
          variant="operator"
          onClick={() => onAppendToken('÷')}
          ariaLabel="Divide"
        />

        {/* Row 2 */}
        <CalculatorButton
          label="("
          variant="action"
          onClick={() => onAppendToken('(')}
          ariaLabel="Left parenthesis"
        />
        <CalculatorButton
          label=")"
          variant="action"
          onClick={() => onAppendToken(')')}
          ariaLabel="Right parenthesis"
        />
        <CalculatorButton
          label="√"
          variant="operator"
          onClick={() => onAppendToken('√')}
          ariaLabel="Square root"
        />
        <CalculatorButton
          label="×"
          variant="operator"
          onClick={() => onAppendToken('×')}
          ariaLabel="Multiply"
        />

        {/* Row 3 */}
        <CalculatorButton label="7" onClick={() => onAppendToken('7')} />
        <CalculatorButton label="8" onClick={() => onAppendToken('8')} />
        <CalculatorButton label="9" onClick={() => onAppendToken('9')} />
        <CalculatorButton
          label="-"
          variant="operator"
          onClick={() => onAppendToken('-')}
          ariaLabel="Subtract"
        />

        {/* Row 4 */}
        <CalculatorButton label="4" onClick={() => onAppendToken('4')} />
        <CalculatorButton label="5" onClick={() => onAppendToken('5')} />
        <CalculatorButton label="6" onClick={() => onAppendToken('6')} />
        <CalculatorButton
          label="+"
          variant="operator"
          onClick={() => onAppendToken('+')}
          ariaLabel="Add"
        />

        {/* Row 5 */}
        <CalculatorButton label="1" onClick={() => onAppendToken('1')} />
        <CalculatorButton label="2" onClick={() => onAppendToken('2')} />
        <CalculatorButton label="3" onClick={() => onAppendToken('3')} />
        <CalculatorButton
          label="="
          variant="equals"
          onClick={onCalculate}
          ariaLabel="Calculate equals"
        />

        {/* Row 6 */}
        <CalculatorButton
          label="±"
          variant="action"
          onClick={onToggleSign}
          ariaLabel="Toggle sign"
        />
        <CalculatorButton label="0" onClick={() => onAppendToken('0')} />
        <CalculatorButton label="." onClick={() => onAppendToken('.')} ariaLabel="Decimal point" />
        <CalculatorButton
          label={<RotateCcw className="w-4 h-4" />}
          variant="action"
          onClick={onClear}
          ariaLabel="Reset"
        />
      </div>

      {/* Primary Action Button: "Use Result" / "Copy Result" */}
      <button
        type="button"
        onClick={onUseResult}
        className="w-full py-2.5 px-4 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
      >
        <Copy className="w-4 h-4" />
        <span>Use / Copy Result</span>
      </button>
    </div>
  );
};

export default React.memo(CalculatorKeypad);
