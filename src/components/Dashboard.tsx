import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Utensils, Car, ShoppingBag, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Plus, ChevronLeft, ChevronRight, Landmark } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { TransactionModal } from './TransactionModal';
import { formatCurrency } from '../utils/formatters';

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
  const { transactions, categories, accounts } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthLabel = MONTHS[selectedDate.getMonth()];
  const yearLabel = selectedDate.getFullYear();

  const handlePrevMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Helper para saldo da conta
  const getAccountBalance = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return 0;
    const txSum = transactions.reduce((acc, tx) => {
      if (tx.accountId === accountId) return acc + tx.amount;
      if (tx.type === 'TRANSFER' && tx.destinationAccountId === accountId) return acc + Math.abs(tx.amount);
      return acc;
    }, 0);
    return account.balance + txSum;
  };

  // Cálculos Baseados no Período
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
    });
  }, [transactions, selectedDate]);

  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, account) => acc + account.balance, 0) + 
           transactions.reduce((acc, tx) => acc + tx.amount, 0);
  }, [accounts, transactions]);

  const monthExpenses = useMemo(() => {
    return currentMonthTransactions.filter(t => t.type === 'OUT').reduce((acc, tx) => acc + Math.abs(tx.amount), 0);
  }, [currentMonthTransactions]);

  const monthRevenue = useMemo(() => {
    return currentMonthTransactions.filter(t => t.type === 'IN').reduce((acc, tx) => acc + tx.amount, 0);
  }, [currentMonthTransactions]);

  const openFaturas = useMemo(() => {
    return accounts.filter(a => a.type === 'CREDIT').reduce((acc, a) => acc + Math.abs(getAccountBalance(a.id)), 0);
  }, [accounts, transactions]);

  const expenseData = useMemo(() => {
    return categories.map(cat => ({
      name: cat.label,
      value: currentMonthTransactions.filter(t => t.categoryId === cat.id && t.type === 'OUT').reduce((s, t) => s + Math.abs(t.amount), 0),
      color: cat.color
    })).filter(d => d.value > 0);
  }, [categories, currentMonthTransactions]);

  const trendData = useMemo(() => {
    return [
      { month: 'Jan', revenue: 4500, expenses: 3200 },
      { month: 'Fev', revenue: 4500, expenses: 4100 },
      { month: 'Mar', revenue: 5200, expenses: 2900 },
      { month: monthLabel.slice(0, 3), revenue: monthRevenue || 0, expenses: monthExpenses || 0 },
    ];
  }, [monthLabel, monthRevenue, monthExpenses]);

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-background text-white relative overflow-hidden">
      <div className="hidden md:block absolute top-[10%] -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-[20%] -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>Resumo Financeiro</h2>
          <div className="flex items-center gap-3 mt-1 text-gray-400">
            <button onClick={handlePrevMonth} className="hover:text-primary transition-colors"><ChevronLeft size={20}/></button>
            <span className="font-medium min-w-[120px] text-center">{monthLabel} {yearLabel}</span>
            <button onClick={handleNextMonth} className="hover:text-primary transition-colors"><ChevronRight size={20}/></button>
          </div>
        </div>

        {/* Global Balance Card */}
        <div className="bg-surface-variant/40 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Patrimônio Líquido</span>
          <span className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-jakarta)' }}>{formatCurrency(totalBalance)}</span>
        </div>
      </header>

      {/* Account Cards - Horizontal Scroll */}
      <section className="mb-10 relative z-10 overflow-x-auto custom-scrollbar flex gap-6 pb-4">
        {accounts.map(acc => {
          const bal = getAccountBalance(acc.id);
          return (
            <div key={acc.id} className="min-w-[280px] bg-surface-container-low/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all">
              <div className="absolute -right-4 -top-4 w-32 h-32 opacity-10 blur-2xl rounded-full" style={{ backgroundColor: acc.color }} />
              <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5" style={{ color: acc.color }}>
                  {acc.type === 'CASH' ? <Wallet size={20} /> : acc.type === 'CREDIT' ? <CreditCard size={20} /> : <Landmark size={20} />}
                </div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: acc.color, boxShadow: `0 0 10px ${acc.color}` }} />
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
        <div className="bg-primary/5 backdrop-blur-xl p-6 rounded-3xl flex flex-col justify-center border border-primary/10 transition-transform hover:scale-[1.02]">
          <h3 className="text-primary text-[10px] mb-2 font-bold tracking-widest uppercase">Entradas no Mês</h3>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-jakarta)'}}>{formatCurrency(monthRevenue)}</p>
        </div>
        <div className="bg-tertiary/5 backdrop-blur-xl p-6 rounded-3xl flex flex-col justify-center border border-tertiary/10 transition-transform hover:scale-[1.02]">
          <h3 className="text-tertiary text-[10px] mb-2 font-bold tracking-widest uppercase">Saídas no Mês</h3>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-jakarta)'}}>{formatCurrency(-monthExpenses)}</p>
        </div>
        <div className="bg-surface-variant/40 backdrop-blur-xl p-6 rounded-3xl flex flex-col justify-center border border-white/5 shadow-2xl transition-transform hover:scale-[1.02]">
          <h3 className="text-gray-400 text-[10px] mb-2 font-bold tracking-widest uppercase">Crédito Utilizado</h3>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-secondary" style={{ fontFamily: 'var(--font-jakarta)'}}>{formatCurrency(openFaturas)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 relative z-10">
        <div className="bg-surface-variant/30 backdrop-blur-lg p-6 rounded-[2rem] col-span-1 min-h-[320px] flex flex-col border border-white/5 shadow-xl">
          <h3 className="text-lg font-bold mb-6 tracking-wide">Gastos por Categoria ({monthLabel})</h3>
          <div className="flex-1 w-full min-h-[200px]">
            {expenseData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 font-medium text-center">Nenhum gasto lançado em {monthLabel}.</div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 min-h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expenseData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={8} dataKey="value" stroke="none">
                        {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#20201f', border: 'none', borderRadius: '16px', color: '#fff' }} itemStyle={{ color: '#fff' }} formatter={(value) => `R$ ${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Listagem de Categorias com Ícones */}
                <div className="mt-4 space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                  {categories.map(cat => {
                    const value = currentMonthTransactions.filter(t => t.categoryId === cat.id && t.type === 'OUT').reduce((s, t) => s + Math.abs(t.amount), 0);
                    if (value === 0) return null;
                    return (
                      <div key={cat.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5" style={{ color: cat.color }}>
                            {renderIcon(cat.icon)}
                          </div>
                          <span className="text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors">{cat.label}</span>
                        </div>
                        <span className="text-[11px] font-black text-white/80">{formatCurrency(value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface-variant/30 backdrop-blur-lg p-6 rounded-[2rem] col-span-1 lg:col-span-2 min-h-[320px] flex flex-col border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold tracking-wide">Evolução do Saldo</h3>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> Receita</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-tertiary" /> Despesa</span>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#767575" tick={{fill: '#767575', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#767575" tick={{fill: '#767575', fontSize: 12}} axisLine={false} tickLine={false} hide />
                <RechartsTooltip contentStyle={{ backgroundColor: '#20201f', border: 'none', borderRadius: '16px', color: '#fff' }} />
                <Line type="monotone" dataKey="revenue" name="Receita" stroke="#6bfe9c" strokeWidth={4} dot={{r: 0}} activeDot={{r: 6, fill: '#6bfe9c', strokeWidth: 0}} />
                <Line type="monotone" dataKey="expenses" name="Despesa" stroke="#ff7765" strokeWidth={4} dot={{r: 0}} activeDot={{r: 6, fill: '#ff7765', strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-6 tracking-wide ml-2">Últimos Lançamentos em {monthLabel}</h3>
        {currentMonthTransactions.length === 0 ? (
          <div className="bg-surface-variant/20 backdrop-blur-sm p-12 text-center rounded-3xl border border-white/5">
            <p className="text-gray-500 font-medium">Nenhuma transação encontrada para este período.</p>
          </div>
        ) : (
          <div className="bg-surface-variant/20 backdrop-blur-md rounded-[2rem] overflow-hidden p-2 border border-white/5 shadow-2xl">
            {currentMonthTransactions.slice(0, 5).map((tx) => {
              const category = categories.find(c => c.id === tx.categoryId);
              return (
              <div key={tx.id} className="flex items-center justify-between p-4 md:p-5 px-4 md:px-8 hover:bg-white/5 transition-all cursor-pointer rounded-2xl mb-1 last:mb-0 group">
                <div className="flex items-center gap-3 md:gap-5">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center bg-surface-container-highest/50 shadow-inner group-hover:scale-110 transition-transform" style={{ color: category?.color || '#fff' }}>
                    {renderIcon(category?.icon || 'Wallet')}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm md:text-lg text-white group-hover:text-primary transition-colors truncate">
                      {tx.description}
                      {tx.installment && (
                        <span className="ml-2 text-[10px] text-gray-500 font-medium">({tx.installment.current}/{tx.installment.total})</span>
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
            )})}
          </div>
        )}
      </div>

      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-background shadow-[0_0_40px_rgba(107,254,156,0.5)] flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all duration-300 z-50 group">
        <Plus size={32} strokeWidth={3} />
      </button>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
