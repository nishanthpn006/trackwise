/**
 * TrackWise Safe Calculator Engine
 * Implements a deterministic Shunting-Yard tokenizer & evaluator.
 * NEVER uses eval() or Function() constructors.
 */

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

type TokenType = 'NUMBER' | 'OPERATOR' | 'LPAREN' | 'RPAREN' | 'FUNCTION';

interface Token {
  type: TokenType;
  value: string;
  precedence?: number;
}

const OPERATOR_PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '÷': 2,
  '×': 2,
  '%': 2,
};

/**
 * Tokenizes a math string into structured mathematical tokens.
 */
export const tokenize = (expr: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;
  const cleanExpr = expr.replace(/\s+/g, '');

  while (i < cleanExpr.length) {
    const char = cleanExpr[i];

    // Numbers & Decimals
    if (/[\d.]/.test(char)) {
      let numStr = char;
      i++;
      while (i < cleanExpr.length && /[\d.]/.test(cleanExpr[i])) {
        // Prevent double dots in single number token
        if (cleanExpr[i] === '.' && numStr.includes('.')) break;
        numStr += cleanExpr[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Square root function symbol: √
    if (char === '√' || char === 's' || char === 'S') {
      tokens.push({ type: 'FUNCTION', value: 'sqrt' });
      i++;
      continue;
    }

    // Parentheses
    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    // Operators
    if (['+', '-', '*', '/', '÷', '×', '%'].includes(char)) {
      // Handle unary negative sign vs binary subtraction
      if (
        char === '-' &&
        (tokens.length === 0 ||
          tokens[tokens.length - 1].type === 'OPERATOR' ||
          tokens[tokens.length - 1].type === 'LPAREN')
      ) {
        // Unary negative number
        i++;
        let numStr = '-';
        while (i < cleanExpr.length && /[\d.]/.test(cleanExpr[i])) {
          if (cleanExpr[i] === '.' && numStr.includes('.')) break;
          numStr += cleanExpr[i];
          i++;
        }
        if (numStr !== '-') {
          tokens.push({ type: 'NUMBER', value: numStr });
        }
        continue;
      }

      tokens.push({
        type: 'OPERATOR',
        value: char === '×' ? '*' : char === '÷' ? '/' : char,
        precedence: OPERATOR_PRECEDENCE[char] || 1,
      });
      i++;
      continue;
    }

    // Skip unknown characters
    i++;
  }

  return tokens;
};

/**
 * Converts infix token stream to Reverse Polish Notation (RPN) via Shunting-Yard.
 */
export const shuntingYard = (tokens: Token[]): Token[] => {
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'NUMBER') {
      outputQueue.push(token);
    } else if (token.type === 'FUNCTION') {
      operatorStack.push(token);
    } else if (token.type === 'OPERATOR') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== 'LPAREN' &&
        ((operatorStack[operatorStack.length - 1].precedence ?? 0) >= (token.precedence ?? 0))
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    } else if (token.type === 'LPAREN') {
      operatorStack.push(token);
    } else if (token.type === 'RPAREN') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== 'LPAREN'
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'LPAREN') {
        operatorStack.pop();
      }
      if (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type === 'FUNCTION'
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
    }
  }

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop()!);
  }

  return outputQueue;
};

/**
 * Evaluates a Reverse Polish Notation (RPN) token stream safely.
 */
export const evaluateRPN = (rpnTokens: Token[]): number => {
  const stack: number[] = [];

  for (const token of rpnTokens) {
    if (token.type === 'NUMBER') {
      const val = parseFloat(token.value);
      if (isNaN(val)) throw new Error('Invalid number');
      stack.push(val);
    } else if (token.type === 'FUNCTION') {
      if (token.value === 'sqrt') {
        const arg = stack.pop();
        if (arg === undefined || arg < 0) throw new Error('Invalid square root operand');
        stack.push(Math.sqrt(arg));
      }
    } else if (token.type === 'OPERATOR') {
      const b = stack.pop();
      const a = stack.pop();

      if (a === undefined || b === undefined) throw new Error('Invalid expression syntax');

      switch (token.value) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (b === 0) throw new Error('Cannot divide by zero');
          stack.push(a / b);
          break;
        case '%':
          stack.push((a * b) / 100);
          break;
        default:
          throw new Error(`Unsupported operator: ${token.value}`);
      }
    }
  }

  if (stack.length !== 1) throw new Error('Invalid expression format');
  return stack[0];
};

/**
 * High-level evaluator that takes an expression string and returns clean numeric string or error.
 */
export const evaluateExpression = (expr: string): { success: boolean; result: string; rawValue: number | null } => {
  if (!expr || expr.trim() === '') {
    return { success: true, result: '0', rawValue: 0 };
  }

  try {
    const tokens = tokenize(expr);
    if (tokens.length === 0) {
      return { success: true, result: '0', rawValue: 0 };
    }

    const rpn = shuntingYard(tokens);
    const num = evaluateRPN(rpn);

    if (isNaN(num) || !isFinite(num)) {
      return { success: false, result: 'Error', rawValue: null };
    }

    // Format output with reasonable decimals
    const rounded = Math.round(num * 1e8) / 1e8;
    return { success: true, result: rounded.toString(), rawValue: rounded };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error';
    return { success: false, result: errorMsg, rawValue: null };
  }
};

/**
 * Format raw result number into clean Indian Rupee / formatted display string.
 */
export const formatDisplayResult = (val: string | number): string => {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return val.toString();

  try {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 4,
    }).format(num);
  } catch {
    return num.toString();
  }
};
