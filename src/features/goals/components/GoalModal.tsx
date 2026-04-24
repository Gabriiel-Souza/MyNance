import { useState, useEffect } from 'react';
import { X, Check, Target, DollarSign, Calendar, Tag } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { Goal } from '@/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editGoal?: Goal | null;
}

const PRESET_COLORS = [
  '#6bfe9c', '#5cb8fd', '#ff7765', '#ff9383', '#abd6ff', '#8a05be', '#f4f8ff', '#ffb800', '#ff0055'
];

export function GoalModal({ isOpen, onClose, editGoal }: ModalProps) {
  const { addGoal, updateGoal, categories } = useFinanceStore();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (editGoal) {
      setName(editGoal.name);
      setTargetAmount(editGoal.targetAmount.toString());
      setCurrentAmount(editGoal.currentAmount.toString());
      setDeadline(editGoal.deadline.split('T')[0]);
      setCategoryId(editGoal.categoryId || '');
      setColor(editGoal.color);
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setDeadline(new Date().toISOString().split('T')[0]);
      setCategoryId('');
      setColor(PRESET_COLORS[0]);
    }
  }, [editGoal, isOpen]);

  if (!isOpen) return null;

  const isFormValid = name.trim().length > 0 && Number(targetAmount) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      triggerShake();
      return;
    }

    const goalData = {
      name,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      deadline: new Date(deadline).toISOString(),
      categoryId,
      color,
    };

    if (editGoal) {
      updateGoal(editGoal.id, goalData);
    } else {
      addGoal(goalData);
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
          {editGoal ? 'Editar Meta' : 'Nova Meta'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Target size={14} /> Nome da Meta
            </label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-background border border-surface-container-high rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
              placeholder="Ex: Viagem, Carro novo..."
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <DollarSign size={14} /> Valor Alvo
              </label>
              <input 
                type="number" 
                value={targetAmount}
                onChange={e => setTargetAmount(e.target.value)}
                className="w-full bg-background border border-surface-container-high rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <DollarSign size={14} /> Já tenho
              </label>
              <input 
                type="number" 
                value={currentAmount}
                onChange={e => setCurrentAmount(e.target.value)}
                className="w-full bg-background border border-surface-container-high rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Calendar size={14} /> Prazo Final
            </label>
            <input 
              type="date" 
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full bg-background border border-surface-container-high rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Tag size={14} /> Vínculo por Categoria (Opcional)
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryId('')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  categoryId === '' 
                    ? 'bg-white text-background' 
                    : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                Nenhum
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                    categoryId === cat.id 
                      ? 'border-transparent text-background' 
                      : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  style={{ 
                    backgroundColor: categoryId === cat.id ? cat.color : undefined,
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Estilo Neon</label>
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
            {editGoal ? 'Salvar Alterações' : 'Criar Meta'}
          </button>
        </form>
      </div>
    </div>
  );
}
