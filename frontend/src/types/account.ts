export type AccountType =
  | 'CASH'
  | 'BANK'
  | 'WALLET'
  | 'CREDIT_CARD'
  | 'UPI'
  | 'SAVINGS'
  | 'INVESTMENT';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  currentBalance: number;
  currency: string;
  color: string;
  icon: string;
  description?: string;
  isArchived: boolean;
  transactionCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface AccountRequest {
  name: string;
  type: AccountType;
  initialBalance?: number;
  currency?: string;
  color?: string;
  icon?: string;
  description?: string;
}
