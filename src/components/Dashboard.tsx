import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Utensils, Car, ShoppingBag, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
    <div className="flex-1 p-8 ml-64 min-h-screen bg-background text-white">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>Resumo Financeiro</h2>
          <p className="text-gray-400 mt-1">Visão geral do seu dinheiro em Abril</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-center min-h-[140px]">
          <h3 className="text-gray-400 text-sm mb-2 font-medium tracking-wide">Saldo Total Agregado</h3>
          <p className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-jakarta)'}}>R$ {totalBalance.toFixed(2)}</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-center min-h-[140px]">
          <h3 className="text-gray-400 text-sm mb-2 font-medium tracking-wide">Gastos Lançados</h3>
          <p className="text-4xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-jakarta)'}}>R$ {monthExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-center min-h-[140px]">
          <h3 className="text-gray-400 text-sm mb-2 font-medium tracking-wide">Faturas de Crédito base</h3>
          <p className="text-4xl font-bold tracking-tight text-secondary" style={{ fontFamily: 'var(--font-jakarta)'}}>R$ {openFaturas.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Gráfico de Categorias */}
        <div className="bg-surface-container-low p-6 rounded-3xl col-span-1 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-bold mb-6 tracking-wide grow-0">Gastos Reais por Categoria</h3>
          <div className="flex-1 w-full min-h-[220px]">
            {expenseData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 font-medium">Nenhum gasto lançado ainda.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#20201f', border: 'none', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} formatter={(value) => `R$ ${value}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfico de Tendências */}
        <div className="bg-surface-container-low p-6 rounded-3xl col-span-1 lg:col-span-2 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-bold mb-6 tracking-wide grow-0">Projeção Receitas vs Despesas</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="month" stroke="#767575" tick={{fill: '#767575'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#767575" tick={{fill: '#767575'}} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#20201f', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="revenue" name="Receita" stroke="#6bfe9c" strokeWidth={3} dot={{r: 4, fill: '#6bfe9c', strokeWidth: 0}} />
                <Line type="monotone" dataKey="expenses" name="Despesa" stroke="#ff7765" strokeWidth={3} dot={{r: 4, fill: '#ff7765', strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lista de Transações recentes */}
      <div>
        <h3 className="text-xl font-bold mb-6 tracking-wide">Transações Lançadas</h3>
        {transactions.length === 0 ? (
          <div className="text-gray-500 font-medium">Nenhuma transação efetuada.</div>
        ) : (
          <div className="bg-surface-container-low rounded-3xl overflow-hidden py-2">
            {transactions.slice(0, 5).map((tx, index) => {
              const category = categories.find(c => c.id === tx.categoryId);
              return (
              <div key={tx.id} className={`flex items-center justify-between p-4 px-6 hover:bg-surface-container-high transition-colors cursor-pointer ${index !== transactions.length - 1 ? 'border-b border-surface-container-high/50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-container-highest" style={{ color: category?.color || '#fff' }}>
                    {renderIcon(category?.icon || 'Wallet')}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{tx.description}</p>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.amount > 0 ? 'text-primary' : 'text-white'}`} style={{ fontFamily: 'var(--font-jakarta)'}}>
                    {tx.amount > 0 ? '+' : ''}R$ {Math.abs(tx.amount).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-background shadow-[0_0_30px_rgba(107,254,156,0.3)] flex items-center justify-center hover:scale-105 hover:rotate-90 transition-all duration-300 z-40">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
