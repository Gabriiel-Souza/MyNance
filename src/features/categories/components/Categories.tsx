import { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { Plus, Edit2, Trash2, Utensils, Car, ShoppingBag, CreditCard, Wallet, Heart, Gamepad2, Home, Zap, Coffee } from 'lucide-react';
import { CategoryModal } from './CategoryModal';
import type { Category } from '@/types';

const ICONS_MAP: Record<string, any> = {
  Utensils, Car, ShoppingBag, CreditCard, Wallet, Heart, Gamepad2, Home, Zap, Coffee
};

export function Categories() {
  const { categories, deleteCategory } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-background text-white relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-[20%] right-0 w-96 h-96 bg-tertiary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <header className="mb-12 flex justify-between items-end relative z-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>Categorias Dinâmicas</h2>
          <p className="text-gray-400 mt-1">Gerencie suas tags, cores e ícones de categorização</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
        {categories.map(cat => {
          const IconComponent = ICONS_MAP[cat.icon] || Wallet;
          return (
            <div 
              key={cat.id} 
              className="group relative bg-surface-variant/20 backdrop-blur-xl rounded-[2rem] p-8 flex flex-col items-center justify-center border border-white/5 shadow-xl transition-all hover:scale-[1.05] hover:bg-surface-variant/30 min-h-[220px]"
            >
              {/* Glow Behind Icon */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity blur-[40px] rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              
              <div 
                className="w-20 h-20 rounded-3xl mb-6 flex items-center justify-center bg-surface-container-highest/50 shadow-inner relative z-10"
                style={{ color: cat.color }}
              >
                <IconComponent size={36} />
              </div>
              
              <h4 className="text-xl font-bold mb-1 relative z-10 text-center">{cat.label}</h4>
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">{cat.color}</span>
              </div>

              {/* Actions Overlays */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(cat)}
                  className="p-2 rounded-full bg-surface-container-highest text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2 rounded-full bg-surface-container-highest text-gray-400 hover:text-tertiary transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        <button 
          onClick={handleAdd}
          className="border-2 border-dashed border-surface-container-highest rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[220px] transition-all hover:border-primary/40 hover:bg-primary/5 group"
        >
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-surface-container-highest flex items-center justify-center text-gray-600 transition-all group-hover:bg-primary group-hover:text-background group-hover:border-transparent mb-4">
            <Plus size={32} />
          </div>
          <span className="font-bold text-gray-500 group-hover:text-white transition-colors">Nova Categoria</span>
        </button>
      </div>

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editCategory={editingCategory}
      />
    </div>
  );
}
