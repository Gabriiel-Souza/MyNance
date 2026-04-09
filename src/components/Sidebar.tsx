import { Home, CreditCard, PieChart, Settings, Wallet, Tag } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'transactions', label: 'Transações', icon: <Wallet size={20} /> },
    { id: 'accounts', label: 'Contas', icon: <CreditCard size={20} /> },
    { id: 'categories', label: 'Categorias', icon: <Tag size={20} /> },
    { id: 'goals', label: 'Metas', icon: <PieChart size={20} /> },
  ];

  return (
    <aside className="w-64 bg-surface h-screen fixed top-0 left-0 flex flex-col pt-8 pb-4 border-r border-surface-container-low/50">
      <div className="px-8 mb-12">
        <h1 className="text-4xl text-primary font-bold" style={{ fontFamily: 'var(--font-caveat)' }}>
          MyNance
        </h1>
      </div>
      
      <nav className="flex-1 flex flex-col gap-2 px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors font-medium w-full text-left ${
              activePage === item.id 
                ? 'bg-surface-container-high text-primary' 
                : 'text-gray-400 hover:text-white hover:bg-surface-container-low'
            }`}
          >
            {item.icon}
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
  );
}
