import { useFinanceStore } from '@/store/useFinanceStore';
import type { Account, Transaction } from '@/types';
import { useMemo } from 'react';

export function useAccounts() {
  const { accounts, transactions, addAccount, updateAccount, deleteAccount } = useFinanceStore();

  const getAccountBalance = (accountId: string) => {
    const account = accounts.find((a: Account) => a.id === accountId);
    if (!account) return 0;
    
    const txSum = transactions.reduce((acc: number, tx: Transaction) => {
      if (tx.accountId === accountId) {
        return acc + tx.amount;
      }
      if (tx.type === 'TRANSFER' && tx.destinationAccountId === accountId) {
        return acc + Math.abs(tx.amount);
      }
      return acc;
    }, 0);

    return account.balance + txSum;
  };

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum: number, acc: Account) => sum + getAccountBalance(acc.id), 0);
  }, [accounts, transactions]);

  const totalLimitAvailable = useMemo(() => {
    return accounts
      .filter((a: Account) => a.type === 'CREDIT' && a.limit)
      .reduce((sum: number, acc: Account) => sum + (acc.limit || 0) + getAccountBalance(acc.id), 0);
  }, [accounts, transactions]);

  return {
    accounts,
    getAccountBalance,
    totalBalance,
    totalLimitAvailable,
    addAccount,
    updateAccount,
    deleteAccount
  };
}
