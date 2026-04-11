import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Utensils, Car, ShoppingBag, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
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

export function Dashboard() {
  const { transactions, categories, accounts } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Compute dynamic values
  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0) + 
                       transactions.reduce((acc, tx) => acc + tx.amount, 0);
                       
  const monthExpenses = transactions.filter(t => t.type === 'OUT').reduce((acc, tx) => acc + Math.abs(tx.amount), 0);
  const openFaturas = accounts.filter(a => a.type === 'CREDIT').reduce((acc, a) => acc + Math.abs(a.balance), 0);

  // Compute Pie Chart data based on transactions
  const expenseData = categories.map(cat => ({
    name: cat.label,
    value: transactions.filter(t => t.categoryId === cat.id && t.type === 'OUT').reduce((s, t) => s + Math.abs(t.amount), 0),
    color: cat.color
  })).filter(d => d.value > 0);

  const trendData = [
    { month: 'Jan', revenue: 4500, expenses: 3200 },
    { month: 'Fev', revenue: 4500, expenses: 4100 },
    { month: 'Mar', revenue: 5200, expenses: 2900 },
    { month: 'Abr', revenue: transactions.filter(t => t.type === 'IN').reduce((s, t) => s + t.amount, 0) || 5420, expenses: monthExpenses || 1832 },
  ];

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-background text-white relative overflow-hidden">
      {/* Decorative Orbs for Glassmorphism depth - only on desktop for performance and clarity */}
      <div className="hidden md:block absolute top-[10%] -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-[20%] -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <header className="mb-10 flex justify-between items-center relative z-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>Resumo Financeiro</h2>
          <p className="text-gray-400 mt-1">Visão geral do seu dinheiro em Abril</p>
        </div>
      </header>

      {/* Summary Cards with Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10 relative z-10">
        <div className="bg-surface-variant/40 backdrop-blur-xl p-5 md:p-6 rounded-3xl flex flex-col justify-center min-h-[120px] md:min-h-[140px] border border-white/5 shadow-2xl transition-transform hover:scale-[1.02]">
          <h3 className="text-gray-400 text-[10px] md:text-xs mb-2 font-bold tracking-widest uppercase">Saldo Total Agregado</h3>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-jakarta)'}}>R$ {totalBalance.toFixed(2)}</p>
        </div>
        <div className="bg-surface-variant/40 backdrop-blur-xl p-5 md:p-6 rounded-3xl flex flex-col justify-center min-h-[120px] md:min-h-[140px] border border-white/5 shadow-2xl transition-transform hover:scale-[1.02]">
          <h3 className="text-gray-400 text-[10px] md:text-xs mb-2 font-bold tracking-widest uppercase">Gastos Lançados</h3>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-jakarta)'}}>R$ {monthExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-surface-variant/40 backdrop-blur-xl p-5 md:p-6 rounded-3xl flex flex-col justify-center min-h-[120px] md:min-h-[140px] border border-white/5 shadow-2xl transition-transform hover:scale-[1.02]">
          <h3 className="text-gray-400 text-[10px] md:text-xs mb-2 font-bold tracking-widest uppercase">Faturas de Crédito</h3>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-secondary" style={{ fontFamily: 'var(--font-jakarta)'}}>R$ {openFaturas.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 relative z-10">
        {/* Gráfico de Categorias Glass */}
        <div className="bg-surface-variant/30 backdrop-blur-lg p-6 rounded-[2rem] col-span-1 min-h-[320px] flex flex-col border border-white/5 shadow-xl">
          <h3 className="text-lg font-bold mb-6 tracking-wide grow-0">Gastos por Categoria</h3>
          <div className="flex-1 w-full min-h-[220px]">
            {expenseData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 font-medium">Nenhum gasto lançado ainda.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                    {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#20201f', border: 'none', borderRadius: '16px', color: '#fff' }} itemStyle={{ color: '#fff' }} formatter={(value) => `R$ ${value}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfico de Tendências Glass */}
        <div className="bg-surface-variant/30 backdrop-blur-lg p-6 rounded-[2rem] col-span-1 lg:col-span-2 min-h-[320px] flex flex-col border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold tracking-wide">Projeção Receitas vs Despesas</h3>
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

      {/* Lista de Transações com zebra Glass */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-6 tracking-wide ml-2">Transações Recentes</h3>
        {transactions.length === 0 ? (
          <div className="bg-surface-variant/20 backdrop-blur-sm p-12 text-center rounded-3xl border border-white/5">
            <p className="text-gray-500 font-medium">Nenhuma transação efetuada nos últimos dias.</p>
          </div>
        ) : (
          <div className="bg-surface-variant/20 backdrop-blur-md rounded-[2rem] overflow-hidden p-2 border border-white/5 shadow-2xl">
            {transactions.slice(0, 5).map((tx, index) => {
              const category = categories.find(c => c.id === tx.categoryId);
              return (
              <div key={tx.id} className={`flex items-center justify-between p-4 md:p-5 px-4 md:px-8 hover:bg-white/5 transition-all cursor-pointer rounded-2xl mb-1 last:mb-0 group`}>
                <div className="flex items-center gap-3 md:gap-5">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center bg-surface-container-highest/50 shadow-inner group-hover:scale-110 transition-transform" style={{ color: category?.color || '#fff' }}>
                    {renderIcon(category?.icon || 'Wallet')}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm md:text-lg text-white group-hover:text-primary transition-colors truncate">{tx.description}</p>
                    <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-widest truncate">{new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • {category?.label || 'Geral'}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-base md:text-xl font-bold ${tx.amount > 0 ? 'text-primary' : 'text-white'}`} style={{ fontFamily: 'var(--font-jakarta)'}}>
                    {tx.amount > 0 ? '+' : ''}R$ {Math.abs(tx.amount).toFixed(2).replace('.', ',')}
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
