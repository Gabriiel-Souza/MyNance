import { useMemo } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { Transaction, Account } from '@/types';

export function useDashboardStats(selectedDate: Date) {
  const { transactions, accounts, categories } = useFinanceStore();

  const getAccountBalance = (accountId: string) => {
    const account = accounts.find((a: Account) => a.id === accountId);
    if (!account) return 0;
    const txSum = transactions.reduce((acc: number, tx: Transaction) => {
      if (tx.accountId === accountId) return acc + tx.amount;
      if (tx.type === 'TRANSFER' && tx.destinationAccountId === accountId) return acc + Math.abs(tx.amount);
      return acc;
    }, 0);
    return account.balance + txSum;
  };

  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t: Transaction) => {
      const d = new Date(t.date);
      return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
    });
  }, [transactions, selectedDate]);

  const totalBalance = useMemo(() => {
    return accounts.reduce((acc: number, account: Account) => acc + account.balance, 0) + 
           transactions.reduce((acc: number, tx: Transaction) => acc + tx.amount, 0);
  }, [accounts, transactions]);

  const monthExpenses = useMemo(() => {
    return currentMonthTransactions.filter((t: Transaction) => t.type === 'OUT').reduce((acc: number, tx: Transaction) => acc + Math.abs(tx.amount), 0);
  }, [currentMonthTransactions]);

  const monthRevenue = useMemo(() => {
    return currentMonthTransactions.filter((t: Transaction) => t.type === 'IN').reduce((acc: number, tx: Transaction) => acc + tx.amount, 0);
  }, [currentMonthTransactions]);

  const openFaturas = useMemo(() => {
    return accounts.filter((a: Account) => a.type === 'CREDIT').reduce((acc: number, a: Account) => acc + Math.abs(getAccountBalance(a.id)), 0);
  }, [accounts, transactions]);

  return {
    transactions,
    categories,
    accounts,
    currentMonthTransactions,
    totalBalance,
    monthExpenses,
    monthRevenue,
    openFaturas,
    getAccountBalance
  };
}
