import React from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import CalculatorFAB from './CalculatorFAB';
import CalculatorDialog from './CalculatorDialog';

export const CalculatorWidget: React.FC = () => {
  const calculator = useCalculator();

  return (
    <>
      <CalculatorFAB isOpen={calculator.isOpen} onToggle={calculator.toggleOpen} />
      <CalculatorDialog calculator={calculator} />
    </>
  );
};

export default CalculatorWidget;
