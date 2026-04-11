import { useState, useEffect } from 'react';
import { X, Check, Calendar, DollarSign, Tag, CreditCard } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import type { TransactionType } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionModal({ isOpen, onClose }: ModalProps) {
  const { categories, addTransaction, accounts } = useFinanceStore();
  const [type, setType] = useState<TransactionType>('OUT');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [destinationAccountId, setDestinationAccountId] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCategoryId(categories[0]?.id || '');
      setAccountId(accounts[0]?.id || '');
      setDestinationAccountId(accounts[1]?.id || accounts[0]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, categories, accounts]);

  if (!isOpen) return null;

  const isFormValid = () => {
    if (!amount || Number(amount) <= 0) return false;
    if (!desc.trim()) return false;
    if (!accountId) return false;
    
    if (type === 'TRANSFER') {
      return accountId !== destinationAccountId && destinationAccountId !== '';
    } else {
      return categoryId !== '';
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      triggerShake();
      return;
    }

    addTransaction({
      description: desc,
      amount: type === 'OUT' ? -Number(amount) : Number(amount),
      date: new Date(date).toISOString(),
      type,
      categoryId: type === 'TRANSFER' ? '' : categoryId,
      accountId: accountId,
      destinationAccountId: type === 'TRANSFER' ? destinationAccountId : undefined,
      isRecurring: false
    });
    
    setAmount('');
    setDesc('');
    onClose();
  };

  const valid = isFormValid();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-surface-container-highest rounded-3xl p-8 border border-white/5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-8 font-plus-jakarta">Nova Transação</h2>

        <div className="flex gap-2 mb-8 bg-surface-container-low p-1.5 rounded-2xl border border-white/5">
          {(['OUT', 'IN', 'TRANSFER'] as TransactionType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2.5 px-2 text-xs font-black rounded-xl transition-all uppercase tracking-wider ${
                type === t 
                  ? t === 'OUT' ? 'bg-tertiary text-white shadow-lg shadow-tertiary/20' 
                  : t === 'IN' ? 'bg-primary text-background shadow-lg shadow-primary/20'
                  : 'bg-secondary text-background shadow-lg shadow-secondary/20'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'OUT' ? 'Despesa' : t === 'IN' ? 'Receita' : 'Transf.'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <DollarSign size={14} /> Valor (R$)
            </label>
            <input 
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-background border border-surface-container-high rounded-2xl px-5 py-5 text-3xl font-bold focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
              placeholder="0,00"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              Descrição
            </label>
            <input 
              type="text"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full bg-background border border-surface-container-high rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
              placeholder="Ex: Almoço, Salário..."
            />
          </div>

          <div className={type === 'TRANSFER' ? 'flex flex-col gap-6' : 'grid grid-cols-2 gap-4'}>
            <div className={type === 'TRANSFER' ? 'w-full' : ''}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Calendar size={14} /> Data
              </label>
              <input 
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-background border border-surface-container-high rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] [color-scheme:dark]"
              />
            </div>

            {type !== 'TRANSFER' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <CreditCard size={14} /> Conta
                </label>
                <select 
                  value={accountId}
                  onChange={e => setAccountId(e.target.value)}
                  className="w-full bg-background border border-surface-container-high rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] appearance-none cursor-pointer"
                >
                  {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
              </div>
            )}
          </div>

          {type === 'TRANSFER' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <CreditCard size={14} /> Conta de Origem
                </label>
                <select 
                  value={accountId}
                  onChange={e => setAccountId(e.target.value)}
                  className="w-full bg-background border border-surface-container-high rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] appearance-none cursor-pointer"
                >
                  {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <CreditCard size={14} /> Conta de Destino
                </label>
                <select 
                  value={destinationAccountId}
                  onChange={e => setDestinationAccountId(e.target.value)}
                  className={`w-full bg-background border rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] appearance-none cursor-pointer ${accountId === destinationAccountId ? 'border-tertiary shadow-[0_0_15px_rgba(255,119,101,0.2)]' : 'border-surface-container-high'}`}
                >
                  {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
                {accountId === destinationAccountId && (
                  <p className="text-tertiary text-[10px] font-bold uppercase mt-2 tracking-widest animate-pulse">As contas devem ser diferentes</p>
                )}
              </div>
            </>
          )}

          {type !== 'TRANSFER' && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Tag size={14} /> Categoria
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      categoryId === cat.id 
                        ? 'border-transparent text-background shadow-lg' 
                        : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                    }`}
                    style={{ 
                      backgroundColor: categoryId === cat.id ? cat.color : undefined,
                      boxShadow: categoryId === cat.id ? `0 0 15px ${cat.color}40` : undefined
                    }}
                  >
                    {categoryId === cat.id && <Check size={12} className="inline mr-1" strokeWidth={3} />}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit"
            onClick={!valid ? triggerShake : undefined}
            className={`mt-4 w-full bg-primary text-background px-4 py-4 font-black rounded-2xl shadow-[0_0_25px_rgba(107,254,156,0.2)] transition-all text-lg uppercase tracking-tight ${!valid ? 'disabled-glow' : 'hover:scale-[1.02] active:scale-[0.98]'} ${isShaking ? 'animate-shake' : ''}`}
          >
            Confirmar Transação
          </button>
        </form>
      </div>
    </div>
  );
}
