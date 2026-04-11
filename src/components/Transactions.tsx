import { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Wallet, Utensils, Car, ShoppingBag, CreditCard, Search, Plus } from 'lucide-react';
import { TransactionModal } from './TransactionModal';

const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'Utensils': return <Utensils size={24} />;
    case 'Car': return <Car size={24} />;
    case 'ShoppingBag': return <ShoppingBag size={24} />;
    case 'CreditCard': return <CreditCard size={24} />;
    default: return <Wallet size={24} />;
  }
};

export function Transactions() {
  const { transactions, categories } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTransactions = transactions.filter(tx => 
    tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Math.abs(tx.amount).toString().includes(searchTerm)
  );

  // Agrupar por data (simplificado para exemplo)
  const groupedTransactions = filteredTransactions.reduce((acc, tx) => {
    const date = tx.date.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(tx);
    return acc;
  }, {} as Record<string, typeof transactions>);

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-background text-white">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>Transações</h2>
          <p className="text-gray-400 mt-1">Histórico completo de lançamentos</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar transação..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-surface-container-low border border-surface-container-high rounded-full focus:outline-none focus:border-primary transition-colors text-sm w-64"
          />
        </div>
      </header>

      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="bg-surface-container-low p-12 text-center rounded-3xl">
          <p className="text-gray-400 text-lg">Nenhuma transação encontrada.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {Object.entries(groupedTransactions).sort((a,b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()).map(([date, txs]) => (
            <div key={date}>
              <h3 className="text-gray-400 text-sm font-medium mb-4 ml-2">{new Date(date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric'})}</h3>
              <div className="bg-surface-container-low rounded-3xl overflow-hidden py-2">
                {txs.map((tx, index) => {
                  const category = categories.find(c => c.id === tx.categoryId);
                  return (
                    <div key={tx.id} className={`flex items-center justify-between p-4 px-6 hover:bg-surface-container-high transition-colors cursor-pointer ${index !== txs.length - 1 ? 'border-b border-surface-container-high/50' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-container-highest" style={{ color: category?.color || '#fff' }}>
                          {renderIcon(category?.icon || 'Wallet')}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{tx.description}</p>
                          <p className="text-sm" style={{ color: category?.color || '#9ca3af' }}>{category?.label || 'Sem Categoria'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tx.amount > 0 ? 'text-primary' : 'text-white'}`} style={{ fontFamily: 'var(--font-jakarta)'}}>
                          {tx.amount > 0 ? '+' : ''}R$ {Math.abs(tx.amount).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-background shadow-[0_0_30px_rgba(107,254,156,0.3)] flex items-center justify-center hover:scale-105 hover:rotate-90 transition-all duration-300 z-40"
      >
        <Plus size={32} />
      </button>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
