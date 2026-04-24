import { useState, useMemo } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { Transaction, Account } from '@/types';

export function useTransactions(initialDate: Date) {
  const { transactions, categories, accounts } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const handlePrevMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const totalBalance = useMemo(() => {
    return accounts.reduce((acc: number, account: Account) => acc + account.balance, 0) + 
           transactions.reduce((acc: number, tx: Transaction) => acc + tx.amount, 0);
  }, [accounts, transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx: Transaction) => {
      const d = new Date(tx.date);
      const isSameMonth = d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            Math.abs(tx.amount).toString().includes(searchTerm);
      return isSameMonth && matchesSearch;
    });
  }, [transactions, selectedDate, searchTerm]);

  const monthlyResult = useMemo(() => {
    return filteredTransactions.reduce((acc: number, tx: Transaction) => acc + tx.amount, 0);
  }, [filteredTransactions]);

  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((acc: Record<string, Transaction[]>, tx: Transaction) => {
      const date = tx.date.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(tx);
      return acc;
    }, {} as Record<string, Transaction[]>);
  }, [filteredTransactions]);

  return {
    categories,
    searchTerm,
    setSearchTerm,
    selectedDate,
    handlePrevMonth,
    handleNextMonth,
    totalBalance,
    monthlyResult,
    groupedTransactions
  };
}
