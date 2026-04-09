import React from 'react';
import { Home, CreditCard, PieChart, Settings, Wallet } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-surface h-screen fixed top-0 left-0 flex flex-col pt-8 pb-4">
      <div className="px-8 mb-12">
        <h1 className="text-4xl text-primary font-bold" style={{ fontFamily: 'var(--font-caveat)' }}>
          MyNance
        </h1>
      </div>
      
      <nav className="flex-1 flex flex-col gap-2 px-4">
        {[
          { label: 'Dashboard', icon: <Home size={20} />, active: true },
          { label: 'Transações', icon: <Wallet size={20} />, active: false },
          { label: 'Contas', icon: <CreditCard size={20} />, active: false },
          { label: 'Metas', icon: <PieChart size={20} />, active: false },
        ].map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors font-medium ${
              item.active 
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
        <button className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors font-medium text-gray-400 hover:text-white hover:bg-surface-container-low w-full">
          <Settings size={20} />
          Configurações
        </button>
      </div>
    </aside>
  );
}
