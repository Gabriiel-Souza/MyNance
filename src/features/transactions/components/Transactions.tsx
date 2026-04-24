import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Wallet, Utensils, Car, ShoppingBag, CreditCard, Search, Plus, ChevronLeft, ChevronRight, ArrowUpCircle, ArrowDownCircle, Landmark } from 'lucide-react';
import { TransactionModal } from './TransactionModal';
import { formatCurrency } from '@/utils/formatters';
import type { Transaction } from '@/types';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'Utensils': return <Utensils size={24} />;
    case 'Car': return <Car size={24} />;
    case 'ShoppingBag': return <ShoppingBag size={24} />;
    case 'CreditCard': return <CreditCard size={24} />;
    case 'Landmark': return <Landmark size={24} />;
    default: return <Wallet size={24} />;
  }
};

export function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const {
    categories,
    searchTerm,
    setSearchTerm,
    selectedDate,
    handlePrevMonth,
    handleNextMonth,
    totalBalance,
    monthlyResult,
    groupedTransactions
  } = useTransactions(new Date());

  const monthLabel = MONTHS[selectedDate.getMonth()];
  const yearLabel = selectedDate.getFullYear();

  const handleEditTx = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleAddTx = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-background text-white">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>Transações</h2>
          <div className="flex items-center gap-3 mt-1 text-gray-400">
            <button onClick={handlePrevMonth} className="hover:text-primary transition-colors"><ChevronLeft size={20}/></button>
            <span className="font-medium min-w-[120px] text-center">{monthLabel} {yearLabel}</span>
            <button onClick={handleNextMonth} className="hover:text-primary transition-colors"><ChevronRight size={20}/></button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar transação..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-surface-container-low border border-surface-container-high rounded-full focus:outline-none focus:border-primary transition-colors text-sm w-full md:w-64"
          />
        </div>
      </header>

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-surface-variant/30 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 flex flex-col justify-between min-h-[140px] shadow-xl relative overflow-hidden group transition-transform hover:scale-[1.02]">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] items-center flex gap-2 mb-2 relative z-10">
            <Landmark size={14} className="text-primary" /> Patrimônio Líquido Total
          </p>
          <p className="text-4xl font-bold text-white relative z-10" style={{ fontFamily: 'var(--font-jakarta)' }}>
            {formatCurrency(totalBalance)}
          </p>
        </div>

        <div className="bg-surface-variant/30 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 flex flex-col justify-between min-h-[140px] shadow-xl relative overflow-hidden group transition-transform hover:scale-[1.02]">
          <div className={`absolute -right-8 -top-8 w-32 h-32 ${monthlyResult >= 0 ? 'bg-primary/10' : 'bg-tertiary/10'} rounded-full blur-2xl`} />
          <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] items-center flex gap-2 mb-2 relative z-10">
            {monthlyResult >= 0 ? <ArrowUpCircle size={14} className="text-primary" /> : <ArrowDownCircle size={14} className="text-tertiary" />}
            Resultado em {monthLabel}
          </p>
          <p className={`text-4xl font-bold relative z-10 ${monthlyResult >= 0 ? 'text-primary' : 'text-tertiary'}`} style={{ fontFamily: 'var(--font-jakarta)' }}>
            {formatCurrency(monthlyResult)}
          </p>
        </div>
      </div>

      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="bg-surface-variant/20 backdrop-blur-sm p-12 text-center rounded-3xl border border-white/5">
          <p className="text-gray-400 text-lg">Nenhum lançamento encontrado para este período.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {Object.entries(groupedTransactions).sort((a,b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()).map(([date, txs]) => (
            <div key={date}>
              <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-4 ml-4">{new Date(date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric'})}</h3>
              <div className="bg-surface-variant/20 backdrop-blur-md rounded-[2.5rem] overflow-hidden p-2 border border-white/5 shadow-xl">
                {txs.map((tx) => {
                  const category = categories.find(c => c.id === tx.categoryId);
                  return (
                    <div 
                      key={tx.id} 
                      onClick={() => handleEditTx(tx)}
                      className={`flex items-center justify-between p-4 md:p-5 px-6 md:px-10 hover:bg-white/5 transition-all cursor-pointer rounded-2xl mb-1 last:mb-0 group`}
                    >
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.25rem] md:rounded-[1.5rem] flex items-center justify-center bg-surface-container-highest/50 shadow-inner group-hover:scale-110 transition-transform" style={{ color: category?.color || '#fff' }}>
                          {renderIcon(category?.icon || 'Wallet')}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-base md:text-xl text-white group-hover:text-primary transition-colors truncate">
                            {tx.description}
                            {tx.installment && (
                              <span className="ml-2 text-[10px] text-gray-500 font-medium font-inter tracking-normal normal-case">({tx.installment.current}/{tx.installment.total})</span>
                            )}
                          </p>
                          <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-[0.2em] truncate">{category?.label || 'Geral'}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-lg md:text-2xl font-bold ${tx.amount > 0 ? 'text-primary' : 'text-white'}`} style={{ fontFamily: 'var(--font-jakarta)'}}>
                          {formatCurrency(tx.amount)}
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
        onClick={handleAddTx}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-background shadow-[0_0_40px_rgba(107,254,156,0.5)] flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all duration-300 z-50 group"
      >
        <Plus size={32} strokeWidth={3} />
      </button>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editTransaction={editingTransaction}
      />
    </div>
  );
}
