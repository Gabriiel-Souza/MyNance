import { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { Wallet, CreditCard, Landmark, Plus } from 'lucide-react';
import { AccountModal } from './AccountModal';
import { formatCurrency } from '@/utils/formatters';
import type { Account } from '@/types';

export function Accounts() {
  const { accounts, getAccountBalance, totalBalance, totalLimitAvailable } = useAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleEditAccount = (acc: Account) => {
    setSelectedAccount(acc);
    setIsModalOpen(true);
  };

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setIsModalOpen(true);
  };



  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-background text-white">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>Minhas Contas</h2>
          <p className="text-gray-400 mt-1">Gerencie seu saldo e cartões</p>
        </div>
        <button 
          onClick={handleAddAccount}
          className="w-12 h-12 md:w-auto md:px-6 md:h-12 bg-primary text-background rounded-2xl md:rounded-full font-black flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(107,254,156,0.2)]"
        >
          <Plus size={24} />
          <span className="hidden md:inline">Nova Conta</span>
        </button>
      </header>

      {/* Resumo Geral com Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-10">
        <div className="glass-card-high rounded-[2rem] p-8 relative overflow-hidden group">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
          
          <h3 className="text-gray-400 text-xs font-bold mb-2 tracking-widest uppercase">Patrimônio Líquido Total</h3>
          <p className="text-5xl font-bold tracking-tight text-white mb-2" style={{ fontFamily: 'var(--font-jakarta)' }}>
            {formatCurrency(totalBalance)}
          </p>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Plus size={14} /> 1.2% este mês
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-8">
          <h3 className="text-gray-400 text-xs font-bold mb-2 tracking-widest uppercase">Limite de Crédito Disponível</h3>
          <p className="text-5xl font-bold tracking-tight text-secondary" style={{ fontFamily: 'var(--font-jakarta)' }}>
            {formatCurrency(totalLimitAvailable)}
          </p>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-wide">Somado entre todos os seus cartões</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-6 tracking-wide ml-2">Contas e Cartões</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12 relative z-10">
        {accounts.map(acc => {
          const balance = getAccountBalance(acc.id);
          const isCredit = acc.type === 'CREDIT';
          const usagePercent = isCredit && acc.limit ? Math.min(Math.abs(balance) / acc.limit * 100, 100) : 0;

          return (
            <div 
              key={acc.id}
              onClick={() => handleEditAccount(acc)}
              className="glass-card rounded-[2.5rem] p-6 flex flex-col justify-between min-h-[220px] transition-all hover:scale-[1.02] hover:bg-white/5 cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/5 shadow-inner transition-transform group-hover:scale-110"
                    style={{ color: acc.color }}
                  >
                    {acc.type === 'CASH' ? <Wallet size={24} /> : isCredit ? <CreditCard size={24} /> : <Landmark size={24} />}
                  </div>
                  <div>
                    <p className="font-bold text-lg group-hover:text-primary transition-colors">{acc.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">{acc.type}</p>
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: acc.color, boxShadow: `0 0 8px ${acc.color}` }} />
              </div>

              <div>
                <p className="text-gray-500 text-[10px] mb-1 font-bold uppercase tracking-widest">Saldo atual</p>
                <p className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
                  {formatCurrency(balance)}
                </p>
                
                {isCredit && acc.limit && (
                  <div className="mt-6">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">
                      <span>Uso do Limite</span>
                      <span>{formatCurrency(acc.limit || 0)} totais</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${usagePercent}%`, 
                          backgroundColor: acc.color,
                          boxShadow: `0 0 6px ${acc.color}60`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Adicionar nova conta (Placeholder/Botão) */}
        <button 
          onClick={handleAddAccount}
          className="border-2 border-dashed border-white/5 rounded-[2.5rem] p-6 flex flex-col items-center justify-center min-h-[220px] hover:border-primary/40 hover:bg-primary/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-primary group-hover:text-background transition-all mb-4">
            <Plus size={24} />
          </div>
          <p className="font-bold text-gray-500 group-hover:text-white transition-colors">Nova Conta</p>
        </button>
      </div>

      <button 
        onClick={handleAddAccount}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-background shadow-[0_8px_20px_rgba(107,254,156,0.2)] flex items-center justify-center hover:scale-105 hover:rotate-90 transition-all duration-300 z-40"
      >
        <Plus size={32} />
      </button>

      <AccountModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editAccount={selectedAccount}
      />
    </div>
  );
}
