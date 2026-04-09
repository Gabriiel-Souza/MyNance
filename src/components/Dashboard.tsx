import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Utensils, Car, ShoppingBag, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const expenseData = [
  { name: 'Alimentação', value: 850.5, color: '#ff7765' },
  { name: 'Transporte', value: 340.2, color: '#5cb8fd' },
  { name: 'Lazer', value: 420.0, color: '#a855f7' },
  { name: 'Outros', value: 221.75, color: '#484847' },
];

const trendData = [
  { month: 'Jan', revenue: 4500, expenses: 3200 },
  { month: 'Fev', revenue: 4500, expenses: 4100 },
  { month: 'Mar', revenue: 5200, expenses: 2900 },
  { month: 'Abr', revenue: 5420, expenses: 1832 },
];

const recentTransactions = [
  { id: 1, desc: 'Supermercado Nova Era', date: 'Hoje, 10:45', amount: -245.50, type: 'expense', icon: Utensils, color: 'text-tertiary', bgColor: 'bg-tertiary/10' },
  { id: 2, desc: 'Salário', date: 'Hoje, 09:00', amount: 5420.00, type: 'income', icon: ArrowUpRight, color: 'text-primary', bgColor: 'bg-primary/10' },
  { id: 3, desc: 'Uber', date: 'Ontem, 19:20', amount: -32.90, type: 'expense', icon: Car, color: 'text-tertiary', bgColor: 'bg-tertiary/10' },
  { id: 4, desc: 'Fatura Cartão Nubank', date: '12 Abr', amount: -1250.00, type: 'card', icon: CreditCard, color: 'text-secondary', bgColor: 'bg-secondary/10' },
  { id: 5, desc: 'Compra Amazon', date: '10 Abr', amount: -89.90, type: 'expense', icon: ShoppingBag, color: 'text-tertiary', bgColor: 'bg-tertiary/10' },
];

export function Dashboard() {
  return (
    <div className="flex-1 p-8 ml-64 min-h-screen bg-background text-white">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>Resumo Financeiro</h2>
          <p className="text-gray-400 mt-1">Visão geral do seu dinheiro em Abril</p>
        </div>
      </header>

      {/* Summary Cards sem bordas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-center min-h-[140px]">
          <h3 className="text-gray-400 text-sm mb-2 font-medium tracking-wide">Saldo Total</h3>
          <p className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-jakarta)'}}>R$ 5.420,00</p>
          <div className="flex items-center gap-2 mt-4 text-primary text-sm font-medium">
            <ArrowUpRight size={16} /> +12% do mês passado
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-center min-h-[140px]">
          <h3 className="text-gray-400 text-sm mb-2 font-medium tracking-wide">Despesas do Mês</h3>
          <p className="text-4xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-jakarta)'}}>R$ 1.832,45</p>
          <div className="flex items-center gap-2 mt-4 text-tertiary text-sm font-medium">
            <ArrowDownRight size={16} /> Cuidado com alimentação
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-center min-h-[140px]">
          <h3 className="text-gray-400 text-sm mb-2 font-medium tracking-wide">Faturas Abertas</h3>
          <p className="text-4xl font-bold tracking-tight text-secondary" style={{ fontFamily: 'var(--font-jakarta)'}}>R$ 1.250,00</p>
          <div className="flex items-center gap-2 mt-4 text-gray-400 text-sm font-medium">
            Vence em 5 dias
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Gráfico de Categorias */}
        <div className="bg-surface-container-low p-6 rounded-3xl col-span-1 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-bold mb-6 tracking-wide grow-0">Gastos por Categoria</h3>
          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#20201f', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => `R$ ${value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-2 justify-center">
            {expenseData.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Tendências */}
        <div className="bg-surface-container-low p-6 rounded-3xl col-span-1 lg:col-span-2 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-bold mb-6 tracking-wide grow-0">Receitas vs Despesas</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="month" stroke="#767575" tick={{fill: '#767575'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#767575" tick={{fill: '#767575'}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#20201f', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="revenue" name="Receita" stroke="#6bfe9c" strokeWidth={3} dot={{r: 4, fill: '#6bfe9c', strokeWidth: 0}} />
                <Line type="monotone" dataKey="expenses" name="Despesa" stroke="#ff7765" strokeWidth={3} dot={{r: 4, fill: '#ff7765', strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lista de Transações recentes combinada com background shifts no item do que com linhas! */}
      <div>
        <h3 className="text-xl font-bold mb-6 tracking-wide">Transações Recentes</h3>
        <div className="bg-surface-container-low rounded-3xl overflow-hidden py-2">
          {recentTransactions.map((tx, index) => (
            <div 
              key={tx.id} 
              className={`flex items-center justify-between p-4 px-6 hover:bg-surface-container-high transition-colors cursor-pointer ${index !== recentTransactions.length - 1 ? 'border-b border-surface-container-high/50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.bgColor} ${tx.color}`}>
                  <tx.icon size={24} />
                </div>
                <div>
                  <p className="font-semibold text-white">{tx.desc}</p>
                  <p className="text-sm text-gray-400">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.amount > 0 ? 'text-primary' : 'text-white'}`} style={{ fontFamily: 'var(--font-jakarta)'}}>
                  {tx.amount > 0 ? '+' : ''}R$ {Math.abs(tx.amount).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB (Floating Action Button) de Adicionar - Glassmorphism */}
      <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-background shadow-[0_0_30px_rgba(107,254,156,0.3)] flex items-center justify-center hover:scale-105 hover:rotate-90 transition-all duration-300 z-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

    </div>
  );
}
