import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, Account, Category, Goal } from '../types';

interface FinanceState {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  goals: Goal[];
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>, repeatCount?: number) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  removeTransaction: (id: string, deleteAllFuture?: boolean) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => void;
  updateAccount: (id: string, account: Partial<Omit<Account, 'id'>>) => void;
  deleteAccount: (id: string) => void;
  
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

      addTransaction: (tx, repeatCount = 1) => set((state) => {
        if (repeatCount > 1) {
          const recurrenceId = crypto.randomUUID();
          const newTxs: Transaction[] = [];
          const baseDate = new Date(tx.date);
          
          for (let i = 0; i < repeatCount; i++) {
            const date = new Date(baseDate);
            date.setMonth(baseDate.getMonth() + i);
            
            newTxs.push({
              ...tx,
              id: crypto.randomUUID(),
              date: date.toISOString(),
              recurrenceId,
              installment: tx.installment ? { 
                current: i + 1, 
                total: repeatCount 
              } : undefined
            });
          }
          return { transactions: [...newTxs, ...state.transactions] };
        }

        return {
          transactions: [
            { ...tx, id: crypto.randomUUID() },
            ...state.transactions
          ]
        };
      }),

      updateTransaction: (id, tx) => set((state) => ({
        transactions: state.transactions.map(t => t.id === id ? { ...t, ...tx } : t)
      })),
      
      removeTransaction: (id, deleteAllFuture = false) => set((state) => {
        const txToDelete = state.transactions.find(t => t.id === id);
        if (!txToDelete) return state;

        if (deleteAllFuture && txToDelete.recurrenceId) {
          const deleteDate = new Date(txToDelete.date);
          return {
            transactions: state.transactions.filter(t => 
              t.recurrenceId !== txToDelete.recurrenceId || 
              new Date(t.date) < deleteDate
            )
          };
        }

        return {
          transactions: state.transactions.filter(tx => tx.id !== id)
        };
      }),

      addAccount: (acc) => set((state) => ({
        accounts: [...state.accounts, { ...acc, id: crypto.randomUUID() }]
      })),

      updateAccount: (id, acc) => set((state) => ({
        accounts: state.accounts.map(a => a.id === id ? { ...a, ...acc } : a)
      })),

      deleteAccount: (id) => set((state) => ({
        accounts: state.accounts.filter(a => a.id !== id),
        transactions: state.transactions.filter(t => t.accountId !== id && t.destinationAccountId !== id)
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
