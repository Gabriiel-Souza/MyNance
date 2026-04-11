import { useState, useEffect } from 'react';
import { X, Check, Utensils, Car, ShoppingBag, CreditCard, Wallet, Heart, Gamepad2, Home, Zap, Coffee } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import type { Category } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editCategory?: Category | null;
}

const CATEGORY_ICONS = [
  { name: 'Utensils', icon: Utensils },
  { name: 'Car', icon: Car },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'Wallet', icon: Wallet },
  { name: 'Heart', icon: Heart },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Home', icon: Home },
  { name: 'Zap', icon: Zap },
  { name: 'Coffee', icon: Coffee },
];

const PRESET_COLORS = [
  '#6bfe9c', '#5cb8fd', '#ff7765', '#ff9383', '#abd6ff', '#8a05be', '#f4f8ff', '#ffb800', '#ff0055'
];

export function CategoryModal({ isOpen, onClose, editCategory }: ModalProps) {
  const { addCategory, updateCategory } = useFinanceStore();
  const [label, setLabel] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState('Wallet');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (editCategory) {
      setLabel(editCategory.label);
      setColor(editCategory.color);
      setIcon(editCategory.icon);
    } else {
      setLabel('');
      setColor(PRESET_COLORS[0]);
      setIcon('Wallet');
    }
  }, [editCategory, isOpen]);

  if (!isOpen) return null;

  const isFormValid = label.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      triggerShake();
      return;
    }

    if (editCategory) {
      updateCategory(editCategory.id, { label, color, icon });
    } else {
      addCategory({ label, color, icon });
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
      
      <div className="relative w-full max-w-md bg-surface-container-highest rounded-3xl p-8 border border-white/5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-jakarta)' }}>
          {editCategory ? 'Editar Categoria' : 'Nova Categoria'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nome da Tag</label>
            <input 
              type="text" 
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="w-full bg-background border border-surface-container-high rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
              placeholder="Ex: Lazer, Saúde..."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Seletor de Cor (Neon)</label>
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

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Escolha um Ícone</label>
            <div className="grid grid-cols-5 gap-3">
              {CATEGORY_ICONS.map(item => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setIcon(item.name)}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${icon === item.name ? 'bg-white/10 text-white border border-white/10' : 'bg-surface-container-low text-gray-500 hover:text-gray-300'}`}
                >
                  <item.icon size={22} color={icon === item.name ? color : undefined} />
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            onClick={!isFormValid ? triggerShake : undefined}
            className={`mt-4 w-full bg-primary text-background px-4 py-4 font-black rounded-2xl shadow-[0_0_25px_rgba(107,254,156,0.2)] transition-all text-lg uppercase tracking-tight ${!isFormValid ? 'disabled-glow' : 'hover:scale-[1.02] active:scale-[0.98]'} ${isShaking ? 'animate-shake' : ''}`}
          >
            {editCategory ? 'Salvar Alterações' : 'Criar Categoria'}
          </button>
        </form>
      </div>
    </div>
  );
}
