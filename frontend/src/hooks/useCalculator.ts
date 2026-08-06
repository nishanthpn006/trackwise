import { useState, useEffect, useCallback } from 'react';
import { evaluateExpression, type CalculationHistoryItem } from '@/utils/calculatorEngine';
import { useToast } from './useToast';

const STORAGE_KEY = 'trackwise_calculator_state';

interface StoredState {
  expression: string;
  result: string;
  history: CalculationHistoryItem[];
}

export function useCalculator() {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);

  // Load initial state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredState = JSON.parse(stored);
        if (parsed.expression !== undefined) setExpression(parsed.expression);
        if (parsed.result !== undefined) setResult(parsed.result);
        if (Array.isArray(parsed.history)) setHistory(parsed.history);
      }
    } catch {
      // Ignore storage read failures
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      const payload: StoredState = { expression, result, history };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage write failures
    }
  }, [expression, result, history]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openCalculator = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCalculator = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearExpression = useCallback(() => {
    setExpression('');
    setResult('0');
  }, []);

  const backspace = useCallback(() => {
    setExpression((prev) => {
      if (prev.length <= 1) {
        setResult('0');
        return '';
      }
      const next = prev.slice(0, -1);
      const evalRes = evaluateExpression(next);
      if (evalRes.success && evalRes.result !== '0') {
        setResult(evalRes.result);
      }
      return next;
    });
  }, []);

  const appendToken = useCallback((token: string) => {
    setExpression((prev) => {
      let next = prev;
      if (token === '×') token = '*';
      if (token === '÷') token = '/';

      // Prevent starting with operators except '-' or '('
      if (prev === '' && ['+', '*', '/', '%'].includes(token)) {
        return prev;
      }

      next = prev + token;
      const evalRes = evaluateExpression(next);
      if (evalRes.success && evalRes.result !== '0') {
        setResult(evalRes.result);
      }
      return next;
    });
  }, []);

  const toggleSign = useCallback(() => {
    setExpression((prev) => {
      if (!prev) return '-';
      if (prev.startsWith('-')) return prev.slice(1);
      return `-${prev}`;
    });
  }, []);

  const calculate = useCallback(() => {
    if (!expression.trim()) return;

    const evalRes = evaluateExpression(expression);
    if (evalRes.success && evalRes.result !== null) {
      const finalRes = evalRes.result;
      setResult(finalRes);

      const newItem: CalculationHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        expression,
        result: finalRes,
        timestamp: Date.now(),
      };

      setHistory((prev) => [newItem, ...prev.slice(0, 19)]); // Keep last 20 items
      setExpression(finalRes);
    } else {
      setResult('Error');
    }
  }, [expression]);

  const useResult = useCallback(async () => {
    if (!result || result === 'Error') return;

    try {
      await navigator.clipboard.writeText(result);
      toast.success(`Amount ${result} copied to clipboard.`);
    } catch {
      toast.error('Failed to copy result to clipboard.');
    }
  }, [result, toast]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Keyboard shortcut support when calculator is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing inside an explicit input or textarea outside calculator
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') &&
        !activeEl.closest('#trackwise-calculator-widget')
      ) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        appendToken(e.key);
      } else if (['+', '-', '*', '/', '.', '%', '(', ')'].includes(e.key)) {
        appendToken(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeCalculator();
      } else if (e.key === 'Delete') {
        e.preventDefault();
        clearExpression();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, appendToken, calculate, backspace, closeCalculator, clearExpression]);

  return {
    isOpen,
    toggleOpen,
    openCalculator,
    closeCalculator,
    expression,
    result,
    history,
    appendToken,
    clearExpression,
    backspace,
    toggleSign,
    calculate,
    useResult,
    clearHistory,
    setExpression,
  };
}

export type UseCalculatorReturn = ReturnType<typeof useCalculator>;
