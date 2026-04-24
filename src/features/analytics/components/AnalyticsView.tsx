
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp, TrendingDown, Activity, Calculator } from 'lucide-react';

interface AnalyticsViewProps {
  selectedDate: Date;
}

export function AnalyticsView({ selectedDate }: AnalyticsViewProps) {
  const {
    transactions,
    categoryData,
    last6MonthsData,
    savings,
    savingsRate,
    dailyAverage
  } = useAnalytics(selectedDate);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface-variant/10 rounded-[2.5rem] border border-dashed border-white/10">
        <Activity size={48} className="text-gray-600 mb-4" />
        <p className="text-gray-500 font-medium">Aguardando dados para gerar insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Cards de Inteligência */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <TrendingUp size={16} />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Economia Real</span>
          </div>
          <p className="text-2xl font-bold text-white">{Math.max(0, savingsRate).toFixed(1)}%</p>
          <div className="mt-2 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
              <Activity size={16} />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Média Diária</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(dailyAverage)}</p>
          <p className="text-[10px] text-gray-400 mt-1">Este mês</p>
        </div>

        <div className="glass-card p-5 rounded-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary">
              <TrendingDown size={16} />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Foco de Gastos</span>
          </div>
          <p className="text-2xl font-bold text-white truncate">{categoryData.length > 0 ? categoryData[0].name : 'Nenhum'}</p>
          <p className="text-[10px] text-gray-400 mt-1">{categoryData.length > 0 ? formatCurrency(categoryData[0].value) : 'Sem gastos'}</p>
        </div>

        <div className="glass-card p-5 rounded-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Calculator size={16} />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Balanço Final</span>
          </div>
          <p className={`text-2xl font-bold ${savings >= 0 ? 'text-primary' : 'text-tertiary'}`}>
            {formatCurrency(savings)}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">{savings >= 0 ? 'Positivo' : 'Negativo'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Comparação Mensal */}
        <div className="glass-card-high p-8 rounded-[2.5rem]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Fluxo de Caixa</h3>
              <p className="text-xs text-gray-500 mt-1">Comparativo de entradas e saídas</p>
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
        <div className="glass-card-high p-8 rounded-[2.5rem]">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white">Distribuição por Categoria</h3>
            <p className="text-xs text-gray-500 mt-1">Maiores impactos no seu orçamento</p>
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
                    formatter={(val: any) => formatCurrency(val as number)}
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
