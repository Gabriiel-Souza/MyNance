import { Home, CreditCard, Settings, Wallet, Tag, Target, X } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activePage, onNavigate, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'transactions', label: 'Transações', icon: <Wallet size={20} /> },
    { id: 'accounts', label: 'Contas', icon: <CreditCard size={20} /> },
    { id: 'categories', label: 'Categorias', icon: <Tag size={20} /> },
    { id: 'goals', label: 'Metas', icon: <Target size={20} /> },
  ];

  const handleNavigate = (id: string) => {
    onNavigate(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`w-64 bg-surface h-screen fixed top-0 left-0 flex flex-col pt-8 pb-4 border-r border-surface-container-low/50 z-50 transition-transform duration-300 ease-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        <div className="px-8 mb-12 flex justify-between items-center">
          <h1 className="text-4xl text-primary font-bold" style={{ fontFamily: 'var(--font-caveat)' }}>
            MyNance
          </h1>
          <button onClick={onClose} className="md:hidden p-2 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest w-full text-left group border ${
                activePage === item.id 
                  ? 'bg-primary/10 text-primary border-primary/20 shadow-[inset_0_0_12px_rgba(107,254,156,0.05)]' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5 border-transparent'
              }`}
            >
              <span className={`transition-transform group-hover:scale-110 ${activePage === item.id ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <button className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors font-medium text-gray-400 hover:text-white hover:bg-surface-container-low w-full text-left">
            <Settings size={20} />
            Configurações
          </button>
        </div>
      </aside>
    </>
  );
}
