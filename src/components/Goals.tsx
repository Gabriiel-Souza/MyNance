import React, { useState } from 'react';
import { Target, TrendingUp, Calendar, Plus, ChevronRight, Zap } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency } from '../utils/formatters';
import { GoalModal } from './GoalModal';
import type { Goal } from '../types';

export const Goals: React.FC = () => {
  const { goals } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const totalTarget = goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
  const totalCurrent = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
  const globalProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleAddGoal = () => {
    setSelectedGoal(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-background text-white">
      {/* Header Editorial */}
      <header className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold font-plus-jakarta tracking-tight mb-2">
          Minhas Metas
        </h1>
        <p className="text-xl md:text-2xl font-caveat text-primary opacity-80">
          "Economizar é a arte de escolher o seu futuro."
        </p>
      </header>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 relative z-10">
        {/* Card de Resumo Global - Glassmorphism */}
        <div className="lg:col-span-2 relative overflow-hidden glass-card-high rounded-[2rem] p-8 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <span className="text-[10px] font-black font-inter text-gray-500 uppercase tracking-[0.2em] mb-4 block">
                Total Economizado
              </span>
              <div className="flex items-baseline justify-center md:justify-start gap-2 mb-2">
                <span className="text-5xl font-bold font-plus-jakarta">
                  {formatCurrency(totalCurrent)}
                </span>
                <span className="text-primary font-bold text-xs flex items-center gap-1">
                  <TrendingUp size={14} /> +12%
                </span>
              </div>
              <p className="text-gray-500 font-inter text-[10px] uppercase tracking-widest font-bold">
                Meta global: {formatCurrency(totalTarget)}
              </p>
            </div>

            {/* Circular Progress */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="8"
                />
                <circle
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - globalProgress / 100)}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold font-plus-jakarta">{Math.round(globalProgress)}%</span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Progresso</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Dica IA - Glassmorphism Style */}
        <div className="bg-primary/5 backdrop-blur-xl rounded-[2rem] p-8 flex flex-col justify-center border border-primary/10 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 text-primary/10 transition-transform group-hover:scale-110">
            <Zap size={120} />
          </div>
          <div className="flex items-center gap-2 text-primary mb-4 font-bold font-inter text-[10px] uppercase tracking-widest">
            <Zap size={16} fill="currentColor" /> Dica InteliNance
          </div>
          <p className="text-lg font-inter text-white/90 leading-relaxed relative z-10">
            Você pode atingir a meta <span className="text-primary font-bold">'Viagem'</span> 5 dias antes se reduzir em 10% seus gastos com <span className="text-secondary font-bold">Lazer</span> este mês.
          </p>
        </div>
      </div>

      {/* Listagem de Metas */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold font-plus-jakarta">Metas Ativas</h2>
        <button className="flex items-center gap-2 glass-button px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest">
          Filtros <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <div 
              key={goal.id} 
              onClick={() => handleEditGoal(goal)}
              className="glass-card rounded-[2.5rem] p-6 transition-all hover:-translate-y-1 hover:bg-white/5 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-6">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/5 transition-all group-hover:scale-110" 
                  style={{ color: goal.color }}
                >
                  <Target size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold font-inter text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Calendar size={12} /> {daysLeft > 0 ? `${daysLeft} dias` : 'Encerrado'}
                  </span>
                  <span className="text-lg font-bold font-plus-jakarta">
                    {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold font-inter mb-4 group-hover:text-primary transition-colors">{goal.name}</h3>

              {/* Progress Bar Editorial */}
              <div className="mb-6">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span className="text-gray-500">{formatCurrency(goal.currentAmount)}</span>
                  <span className="text-white">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${progress}%`, 
                      backgroundColor: goal.color,
                      boxShadow: `0 0 6px ${goal.color}60`
                    }}
                  />
                </div>
              </div>

              <button className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] transition-all group-hover:bg-primary group-hover:text-background group-hover:border-transparent">
                Ver Detalhes
              </button>
            </div>
          );
        })}

        {/* FAB Style Add Goal Slot */}
        <button 
          onClick={handleAddGoal}
          className="border-2 border-dashed border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all group min-h-[250px]"
        >
          <div className="w-16 h-16 rounded-full bg-on-background/5 flex items-center justify-center group-hover:bg-primary/20 transition-all">
            <Plus size={32} />
          </div>
          <span className="font-bold font-inter">Nova Meta</span>
        </button>
      </div>

      <GoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editGoal={selectedGoal}
      />
    </div>
  );
};
