export type TransactionType = 'IN' | 'OUT';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO date string
  type: TransactionType;
  categoryId: string;
  accountId: string;
  isRecurring: boolean;
}

export type AccountType = 'CREDIT' | 'DEBIT' | 'CASH';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  color: string; // hex
  limit?: number; // only for credit
  balance: number;
}

export interface Category {
  id: string;
  label: string;
  icon: string; // Lucide icon name or similar
  color: string; // hex
}

export interface Installment {
  parentTransactionId: string;
  currentNumber: number;
  totalNumber: number;
}
