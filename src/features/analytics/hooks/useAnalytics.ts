import { useMemo } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { Transaction, Category } from '@/types';

export function useAnalytics(selectedDate: Date) {
  const transactions = useFinanceStore(state => state.transactions);
  const categories = useFinanceStore(state => state.categories);

  const currentMonth = selectedDate?.getMonth() ?? new Date().getMonth();
  const currentYear = selectedDate?.getFullYear() ?? new Date().getFullYear();

  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t: Transaction) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [transactions, currentMonth, currentYear]);

  const categoryData = useMemo(() => {
    const data = categories.map((cat: Category) => ({
      name: cat.label,
      value: currentMonthTransactions
        .filter((t: Transaction) => t.categoryId === cat.id && t.type === 'OUT')
        .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0),
      color: cat.color
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
    return data;
  }, [categories, currentMonthTransactions]);

  const last6MonthsData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      
      const monthTxs = transactions.filter((t: Transaction) => {
        const td = new Date(t.date);
        return td.getMonth() === m && td.getFullYear() === y;
      });

      data.push({
        name: d.toLocaleDateString('pt-BR', { month: 'short' }),
        entradas: monthTxs.filter((t: Transaction) => t.type === 'IN').reduce((s: number, t: Transaction) => s + t.amount, 0),
        saidas: monthTxs.filter((t: Transaction) => t.type === 'OUT').reduce((s: number, t: Transaction) => s + Math.abs(t.amount), 0),
      });
    }
    return data;
  }, [transactions, currentMonth, currentYear]);

  const totalIn = currentMonthTransactions.filter((t: Transaction) => t.type === 'IN').reduce((s: number, t: Transaction) => s + t.amount, 0);
  const totalOut = currentMonthTransactions.filter((t: Transaction) => t.type === 'OUT').reduce((s: number, t: Transaction) => s + Math.abs(t.amount), 0);
  const savings = totalIn - totalOut;
  const savingsRate = totalIn > 0 ? (savings / totalIn) * 100 : 0;
  const dailyAverage = totalOut / 30;

  return {
    transactions,
    categoryData,
    last6MonthsData,
    savings,
    savingsRate,
    dailyAverage
  };
}
