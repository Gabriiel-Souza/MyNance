import { useState, useEffect } from 'react';
import { X, Check, Wallet, CreditCard, Landmark, DollarSign } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import type { Account, AccountType } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editAccount?: Account | null;
}

const PRESET_COLORS = [
  '#6bfe9c', '#5cb8fd', '#ff7765', '#ff9383', '#abd6ff', '#8a05be', '#f4f8ff', '#ffb800', '#ff0055'
];

const ACCOUNT_TYPES: { label: string; value: AccountType; icon: any }[] = [
  { label: 'Corrente / Débito', value: 'DEBIT', icon: Landmark },
  { label: 'Cartão de Crédito', value: 'CREDIT', icon: CreditCard },
];

export function AccountModal({ isOpen, onClose, editAccount }: ModalProps) {
  const { addAccount, updateAccount } = useFinanceStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('DEBIT');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [balance, setBalance] = useState('');
  const [limit, setLimit] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (editAccount) {
      setName(editAccount.name);
      setType(editAccount.type);
      setColor(editAccount.color);
      setBalance(editAccount.balance.toString());
      setLimit(editAccount.limit?.toString() || '');
    } else {
      setName('');
      setType('DEBIT');
      setColor(PRESET_COLORS[0]);
      setBalance('0');
      setLimit('');
    }
  }, [editAccount, isOpen]);

  if (!isOpen) return null;

  const isFormValid = name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      triggerShake();
      return;
    }

    const accountData = {
      name,
      type,
      color,
      balance: Number(balance) || 0,
      limit: type === 'CREDIT' ? Number(limit) : undefined,
    };

    if (editAccount) {
      updateAccount(editAccount.id, accountData);
    } else {
      addAccount(accountData);
    }
    
    onClose();
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-surface-container-highest rounded-3xl p-8 border border-white/5 shadow-xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-8 font-plus-jakarta">
          {editAccount ? 'Editar Conta' : 'Nova Conta'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nome da Conta</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-background border border-surface-container-high rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
              placeholder="Ex: Nubank, Carteira..."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Tipo de Conta</label>
            <div className="grid grid-cols-1 gap-2">
              {ACCOUNT_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${type === t.value ? 'bg-primary/10 border-primary text-primary' : 'bg-surface-container-low border-transparent text-gray-400 hover:border-white/10'}`}
                >
                  <t.icon size={20} />
                  <span className="font-bold text-sm tracking-tight">{t.label}</span>
                  {type === t.value && <Check size={18} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <DollarSign size={14} /> Saldo Inicial
              </label>
              <input 
                type="number" 
                value={balance}
                onChange={e => setBalance(e.target.value)}
                className="w-full bg-background border border-surface-container-high rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                placeholder="0.00"
              />
            </div>
            {type === 'CREDIT' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <DollarSign size={14} /> Limite
                </label>
                <input 
                  type="number" 
                  value={limit}
                  onChange={e => setLimit(e.target.value)}
                  className="w-full bg-background border border-surface-container-high rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Identidade Visual (Neon)</label>
            <div className="flex flex-wrap gap-3">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${color === c ? 'scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check size={18} className="text-background" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            onClick={!isFormValid ? triggerShake : undefined}
            className={`mt-4 w-full bg-primary text-background px-4 py-4 font-black rounded-2xl shadow-[0_0_25px_rgba(107,254,156,0.2)] transition-all text-lg uppercase tracking-tight ${!isFormValid ? 'disabled-glow' : 'hover:scale-[1.02] active:scale-[0.98]'} ${isShaking ? 'animate-shake' : ''}`}
          >
            {editAccount ? 'Salvar Alterações' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  );
}
