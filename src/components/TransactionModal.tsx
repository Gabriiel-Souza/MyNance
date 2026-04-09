import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { TransactionType } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionModal({ isOpen, onClose }: ModalProps) {
  const { categories, addTransaction, accounts } = useFinanceStore();
  const [type, setType] = useState<TransactionType>('OUT');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !desc) return;

    addTransaction({
      description: desc,
      amount: type === 'OUT' ? -Number(amount) : Number(amount),
      date: new Date().toISOString().split('T')[0], // yyyy-mm-dd
      type,
      categoryId,
      accountId: accounts[0]?.id || '', // default to first account
      isRecurring: false
    });
    
    // reset e fechar
    setAmount('');
    setDesc('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal / Card */}
      <div className="relative w-full max-w-md bg-surface-container-highest rounded-2xl p-6 shadow-2xl border border-white/5 z-10 shrink-0">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container-low transition-colors text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-jakarta)'}}>
          Nova Transação
        </h2>

        <div className="flex gap-2 mb-6 bg-surface-container-low p-1 rounded-xl">
          <button
            onClick={() => setType('OUT')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'OUT' ? 'bg-tertiary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Despesa
          </button>
          <button
            onClick={() => setType('IN')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'IN' ? 'bg-primary text-[#003417] shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Receita
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Valor (R$)</label>
            <input 
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-background border border-surface-container-highest rounded-xl px-4 py-3 text-2xl font-bold focus:outline-none focus:border-primary transition-colors placeholder-gray-600 focus:bg-surface-bright shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
              placeholder="0.00"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
            <input 
              type="text"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full bg-background border border-surface-container-highest rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-primary transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
              placeholder="Ex: Almoço Restaurante"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                    categoryId === cat.id 
                      ? 'border-transparent text-black shadow-md' 
                      : 'border-surface-container-high text-gray-300 hover:bg-surface-container-low'
                  }`}
                  style={{ 
                    backgroundColor: categoryId === cat.id ? cat.color : 'transparent',
                    opacity: categoryId === cat.id ? 1 : 0.8
                  }}
                >
                  {categoryId === cat.id && <Check size={14} className="inline mr-1" />}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="mt-4 w-full bg-primary text-background px-4 py-4 font-bold rounded-xl shadow-[0_0_15px_rgba(107,254,156,0.3)] hover:scale-[1.02] transition-transform text-lg"
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}
