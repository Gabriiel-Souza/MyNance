import { useState } from 'react';
import { Utensils, Car, ShoppingBag, CreditCard, Wallet, Plus, ChevronLeft, ChevronRight, Landmark, LayoutDashboard, BarChart3 } from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { TransactionModal } from '@/features/transactions/components/TransactionModal';
import { AnalyticsView } from '@/features/analytics/components/AnalyticsView';
import { formatCurrency } from '@/utils/formatters';

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

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'ANALYTICS'>('SUMMARY');

  const {
    categories,
    accounts,
    currentMonthTransactions,
    totalBalance,
    monthExpenses,
    monthRevenue,
    openFaturas,
    getAccountBalance
  } = useDashboardStats(selectedDate);

  const monthLabel = MONTHS[selectedDate.getMonth()];
  const yearLabel = selectedDate.getFullYear();

  const handlePrevMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-background text-white relative overflow-hidden">
      {/* Background Decor - Refined blur */}
      <div className="hidden md:block absolute top-[5%] -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-[15%] -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-[60px] pointer-events-none" />
      
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-jakarta)' }}>Resumo Financeiro</h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 text-gray-400 glass-card px-4 py-2 rounded-2xl">
              <button onClick={handlePrevMonth} className="hover:text-primary transition-colors"><ChevronLeft size={20}/></button>
              <span className="font-bold min-w-[120px] text-center text-xs tracking-widest uppercase">{monthLabel} {yearLabel}</span>
              <button onClick={handleNextMonth} className="hover:text-primary transition-colors"><ChevronRight size={20}/></button>
            </div>

            <div className="flex glass-card p-1 rounded-2xl">
              <button 
                onClick={() => setActiveTab('SUMMARY')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'SUMMARY' ? 'bg-primary text-background' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <LayoutDashboard size={14} /> Resumo
              </button>
              <button 
                onClick={() => setActiveTab('ANALYTICS')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ANALYTICS' ? 'bg-primary text-background' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <BarChart3 size={14} /> Insights
              </button>
            </div>
          </div>
        </div>

        {/* Global Balance Card */}
        <div className="glass-card-high px-8 py-5 rounded-[2rem] flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Patrimônio Líquido</span>
          <span className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-jakarta)' }}>{formatCurrency(totalBalance)}</span>
        </div>
      </header>

      {activeTab === 'SUMMARY' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Account Cards - Horizontal Scroll */}
          <section className="mb-10 relative z-10 overflow-x-auto custom-scrollbar flex gap-6 pb-4">
            {accounts.map(acc => {
              const bal = getAccountBalance(acc.id);
              return (
                <div key={acc.id} className="min-w-[280px] glass-card rounded-[2.5rem] p-6 relative overflow-hidden group hover:scale-[1.02] transition-all">
                  <div className="absolute -right-4 -top-4 w-32 h-32 opacity-10 blur-2xl rounded-full" style={{ backgroundColor: acc.color }} />
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/5" style={{ color: acc.color }}>
                      {acc.type === 'CASH' ? <Wallet size={20} /> : acc.type === 'CREDIT' ? <CreditCard size={20} /> : <Landmark size={20} />}
                    </div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: acc.color, boxShadow: `0 0 8px ${acc.color}` }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{acc.name}</p>
                    <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jakarta)' }}>{formatCurrency(bal)}</p>
                  </div>
                </div>
              )
            })}
          </section>

          {/* Monthly Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 relative z-10">
            <div className="bg-primary/5 backdrop-blur-xl p-6 rounded-[2rem] flex flex-col justify-center border border-primary/10 transition-transform hover:scale-[1.02]">
              <h3 className="text-primary text-[10px] mb-2 font-bold tracking-widest uppercase">Entradas no Mês</h3>
              <p className="text-3xl md:text-4xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-jakarta)'}}>{formatCurrency(monthRevenue)}</p>
            </div>
            <div className="bg-tertiary/5 backdrop-blur-xl p-6 rounded-[2rem] flex flex-col justify-center border border-tertiary/10 transition-transform hover:scale-[1.02]">
              <h3 className="text-tertiary text-[10px] mb-2 font-bold tracking-widest uppercase">Saídas no Mês</h3>
              <p className="text-3xl md:text-4xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-jakarta)'}}>{formatCurrency(-monthExpenses)}</p>
            </div>
            <div className="glass-card-high p-6 rounded-[2rem] flex flex-col justify-center transition-transform hover:scale-[1.02]">
              <h3 className="text-gray-400 text-[10px] mb-2 font-bold tracking-widest uppercase">Crédito Utilizado</h3>
              <p className="text-3xl md:text-4xl font-bold tracking-tight text-secondary" style={{ fontFamily: 'var(--font-jakarta)'}}>{formatCurrency(openFaturas)}</p>
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-6 tracking-wide ml-2">Últimos Lançamentos em {monthLabel}</h3>
            {currentMonthTransactions.length === 0 ? (
              <div className="glass-card py-16 text-center rounded-[2.5rem]">
                <p className="text-gray-500 font-medium">Nenhuma transação encontrada para este período.</p>
              </div>
            ) : (
              <div className="glass-card rounded-[2.5rem] overflow-hidden p-2">
                {[...currentMonthTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10).map((tx) => {
                  const category = categories.find(c => c.id === tx.categoryId);
                  return (
                  <div key={tx.id} className="flex items-center justify-between p-4 md:p-5 px-4 md:px-8 hover:bg-white/5 transition-all cursor-pointer rounded-2xl mb-1 last:mb-0 group">
                    <div className="flex items-center gap-3 md:gap-5">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center bg-white/5 shadow-inner group-hover:scale-110 transition-transform" style={{ color: category?.color || '#fff' }}>
                        {renderIcon(category?.icon || 'Wallet')}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm md:text-lg text-white group-hover:text-primary transition-colors truncate">
                          {tx.description}
                          {tx.installment && (
                            <span className="ml-2 text-[10px] text-gray-500 font-medium font-jakarta">({tx.installment.current}/{tx.installment.total})</span>
                          )}
                        </p>
                        <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-widest truncate">{new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • {category?.label || 'Geral'}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-base md:text-xl font-bold ${tx.amount > 0 ? 'text-primary' : 'text-white'}`} style={{ fontFamily: 'var(--font-jakarta)'}}>
                        {formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <AnalyticsView selectedDate={selectedDate} />
      )}

      <button 
        onClick={() => setIsModalOpen(true)} 
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-background shadow-[0_8px_20px_rgba(107,254,156,0.2)] flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all duration-300 z-50 group"
      >
        <Plus size={32} strokeWidth={3} />
      </button>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
