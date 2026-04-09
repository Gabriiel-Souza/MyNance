import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Account, Category } from '../types';

interface FinanceState {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
}

// Valores iniciais para simular a Dashboard
const initialCategories: Category[] = [
  { id: '1', label: 'Alimentação', icon: 'Utensils', color: '#ff7765' },
  { id: '2', label: 'Transporte', icon: 'Car', color: '#5cb8fd' },
  { id: '3', label: 'Dinheiro', icon: 'Wallet', color: '#6bfe9c' },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: [],
      accounts: [
        { id: '1', name: 'Nubank', type: 'CREDIT', color: '#8a05be', balance: -1250, limit: 3000 },
        { id: '2', name: 'Carteira', type: 'CASH', color: '#6bfe9c', balance: 5420 },
      ],
      categories: initialCategories,

      addTransaction: (tx) => set((state) => ({
        transactions: [
          { ...tx, id: crypto.randomUUID() },
          ...state.transactions
        ]
      })),
      
      removeTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(tx => tx.id !== id)
      })),

      addAccount: (acc) => set((state) => ({
        accounts: [...state.accounts, { ...acc, id: crypto.randomUUID() }]
      })),

      addCategory: (cat) => set((state) => ({
        categories: [...state.categories, { ...cat, id: crypto.randomUUID() }]
      }))
    }),
    {
      name: 'mynance-storage',
    }
  )
);
