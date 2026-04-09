import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, Account, Category, Goal } from '../types';

interface FinanceState {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  goals: Goal[];
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => void;
  
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Omit<Goal, 'id'>>) => void;
  deleteGoal: (id: string) => void;
}

// Valores iniciais para simular a Dashboard
const initialCategories: Category[] = [
  { id: '1', label: 'Alimentação', icon: 'Utensils', color: '#ff7765' },
  { id: '2', label: 'Transporte', icon: 'Car', color: '#5cb8fd' },
  { id: '3', label: 'Dinheiro', icon: 'Wallet', color: '#6bfe9c' },
];

const initialGoals: Goal[] = [
  { id: '1', name: 'Mercado', targetAmount: 1200, currentAmount: 850, deadline: '2026-04-21T00:00:00Z', color: '#5cb8fd' },
  { id: '2', name: 'Viagem', targetAmount: 4000, currentAmount: 3100, deadline: '2026-05-24T00:00:00Z', color: '#6bfe9c' },
  { id: '3', name: 'Roupas', targetAmount: 800, currentAmount: 720, deadline: '2026-04-11T00:00:00Z', color: '#ff7765' },
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
      })),

      updateCategory: (id, cat) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...cat } : c)
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id),
        // Opcional: Limpar referências nas transações (vincular a "Sem Categoria" ou ID vazio)
        transactions: state.transactions.map(t => t.categoryId === id ? { ...t, categoryId: '' } : t)
      })),

      goals: initialGoals,

      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: crypto.randomUUID() }]
      })),

      updateGoal: (id, goal) => set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, ...goal } : g)
      })),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id)
      }))
    }),
    {
      name: 'mynance-storage',
    }
  )
);
