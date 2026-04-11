import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area
} from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';

interface AnalyticsViewProps {
  selectedDate: Date;
}

export function AnalyticsView({ selectedDate }: AnalyticsViewProps) {
  const { transactions, categories } = useFinanceStore(state => ({
    transactions: state.transactions,
    categories: state.categories,
  }));

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const currentMonthTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [transactions, currentMonth, currentYear]);

  // Dados para Gráfico de Pizza (Categorias)
  const categoryData = useMemo(() => {
    return categories.map(cat => ({
      name: cat.label,
      value: currentMonthTransactions
        .filter(t => t.categoryId === cat.id && t.type === 'OUT')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0),
      color: cat.color
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
  }, [categories, currentMonthTransactions]);

  // Dados para Gráfico de Barras (Últimos 6 meses)
  const last6MonthsData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      
      const monthTxs = transactions.filter(t => {
        const td = new Date(t.date);
        return td.getMonth() === m && td.getFullYear() === y;
      });

      data.push({
        name: d.toLocaleDateString('pt-BR', { month: 'short' }),
        entradas: monthTxs.filter(t => t.type === 'IN').reduce((s, t) => s + t.amount, 0),
        saidas: monthTxs.filter(t => t.type === 'OUT').reduce((s, t) => s + Math.abs(t.amount), 0),
      });
    }
    return data;
  }, [transactions, currentMonth, currentYear]);

  const totalIn = currentMonthTransactions.filter(t => t.type === 'IN').reduce((s, t) => s + t.amount, 0);
  const totalOut = currentMonthTransactions.filter(t => t.type === 'OUT').reduce((s, t) => s + Math.abs(t.amount), 0);
  const savings = totalIn - totalOut;
  const savingsRate = totalIn > 0 ? (savings / totalIn) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Cards de Inteligência */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-variant/20 backdrop-blur-md p-5 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <TrendingUp size={18} />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Taxa de Economia</span>
          </div>
          <p className="text-2xl font-bold text-white">{savingsRate.toFixed(1)}%</p>
          <div className="mt-2 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }} />
          </div>
        </div>

        <div className="bg-surface-variant/20 backdrop-blur-md p-5 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
              <Zap size={18} />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gasto Diário Médio</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalOut / 30)}</p>
          <p className="text-[10px] text-gray-400 mt-1">Baseado em 30 dias</p>
        </div>

        <div className="bg-surface-variant/20 backdrop-blur-md p-5 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary">
              <TrendingDown size={18} />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Maior Categoria</span>
          </div>
          <p className="text-2xl font-bold text-white truncate">{categoryData[0]?.name || 'N/A'}</p>
          <p className="text-[10px] text-gray-400 mt-1">{categoryData[0] ? formatCurrency(categoryData[0].value) : 'Sem gastos'}</p>
        </div>

        <div className="bg-surface-variant/20 backdrop-blur-md p-5 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Target size={18} />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Balanço do Mês</span>
          </div>
          <p className={`text-2xl font-bold ${savings >= 0 ? 'text-primary' : 'text-tertiary'}`}>
            {formatCurrency(savings)}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">{savings >= 0 ? 'Superávit' : 'Déficit'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Comparação Mensal */}
        <div className="bg-surface-variant/30 backdrop-blur-lg p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Fluxo de Caixa</h3>
              <p className="text-xs text-gray-500 mt-1">Comparativo de entradas e saídas (6 meses)</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last6MonthsData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#767575', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#767575', fontSize: 12}} hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#1a1a19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }}
                />
                <Bar dataKey="entradas" fill="#6bfe9c" radius={[6, 6, 0, 0]} name="Entradas" barSize={30} />
                <Bar dataKey="saidas" fill="#ff7765" radius={[6, 6, 0, 0]} name="Saídas" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza Detalhado */}
        <div className="bg-surface-variant/30 backdrop-blur-lg p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white">Distribuição de Gastos</h3>
            <p className="text-xs text-gray-500 mt-1">Onde você gastou mais este mês</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[240px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }}
                    formatter={(val: number) => formatCurrency(val)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              {categoryData.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-white/90">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
