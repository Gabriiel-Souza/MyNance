import { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Wallet, CreditCard, Landmark, Plus } from 'lucide-react';
import { AccountModal } from './AccountModal';
import type { Account } from '../types';

export function Accounts() {
  const { accounts, transactions } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const getAccountBalance = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return 0;
    
    // Calcula o saldo somando as transações à conta base
    const txSum = transactions.reduce((acc, tx) => {
      // Se a conta for a de origem
      if (tx.accountId === accountId) {
        return acc + tx.amount;
      }
      // Se for uma transferência e for a conta de destino
      if (tx.type === 'TRANSFER' && tx.destinationAccountId === accountId) {
        return acc + Math.abs(tx.amount);
      }
      return acc;
    }, 0);

    return account.balance + txSum;
  };

  const handleEditAccount = (acc: Account) => {
    setSelectedAccount(acc);
    setIsModalOpen(true);
  };

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setIsModalOpen(true);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + getAccountBalance(acc.id), 0);
  const totalLimitAvailable = accounts
    .filter(a => a.type === 'CREDIT' && a.limit)
    .reduce((sum, acc) => sum + (acc.limit || 0) + getAccountBalance(acc.id), 0);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="relative overflow-hidden bg-surface-container-low rounded-3xl p-8 shadow-2xl">
          {/* Neon Glow effect */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          
          <h3 className="text-gray-400 text-sm font-medium mb-2 tracking-wide">Patrimônio Líquido Total</h3>
          <p className="text-5xl font-bold tracking-tight text-white mb-2" style={{ fontFamily: 'var(--font-jakarta)' }}>
            R$ {totalBalance.toFixed(2)}
          </p>
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            <Plus size={16} /> 1.2% este mês
          </div>
        </div>

        <div className="relative overflow-hidden bg-surface-container-low/60 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl">
          <h3 className="text-gray-400 text-sm font-medium mb-2 tracking-wide">Limite de Crédito Disponível</h3>
          <p className="text-5xl font-bold tracking-tight text-secondary" style={{ fontFamily: 'var(--font-jakarta)' }}>
            R$ {totalLimitAvailable.toFixed(2)}
          </p>
          <p className="text-gray-500 text-sm mt-2">Somado entre todos os seus cartões</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-6 tracking-wide ml-2">Suas Carteiras</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {accounts.map(acc => {
          const balance = getAccountBalance(acc.id);
          const isCredit = acc.type === 'CREDIT';
          const usagePercent = isCredit && acc.limit ? Math.min(Math.abs(balance) / acc.limit * 100, 100) : 0;

          return (
            <div 
              key={acc.id}
              onClick={() => handleEditAccount(acc)}
              className="bg-surface-container-high rounded-3xl p-6 flex flex-col justify-between min-h-[220px] transition-transform hover:scale-[1.02] cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-container-highest shadow-inner"
                    style={{ color: acc.color }}
                  >
                    {acc.type === 'CASH' ? <Wallet size={24} /> : isCredit ? <CreditCard size={24} /> : <Landmark size={24} />}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{acc.name}</p>
                    <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">{acc.type}</p>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: acc.color, boxShadow: `0 0 10px ${acc.color}` }} />
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1 font-medium italic">Saldo atual</p>
                <p className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
                  R$ {balance.toFixed(2)}
                </p>
                
                {isCredit && acc.limit && (
                  <div className="mt-6">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-tighter">
                      <span>Uso do Limite</span>
                      <span>R$ {acc.limit.toFixed(0)} totais</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${usagePercent}%`, 
                          backgroundColor: acc.color,
                          boxShadow: `0 0 8px ${acc.color}80`
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
          className="border-2 border-dashed border-surface-container-highest rounded-3xl p-6 flex flex-col items-center justify-center min-h-[220px] hover:border-primary/40 hover:bg-primary/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-surface-container-highest flex items-center justify-center text-gray-500 group-hover:bg-primary group-hover:text-background group-hover:border-transparent transition-all mb-4">
            <Plus size={24} />
          </div>
          <p className="font-bold text-gray-500 group-hover:text-white transition-colors">Nova Conta</p>
        </button>
      </div>

      <button 
        onClick={handleAddAccount}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-background shadow-[0_0_30px_rgba(107,254,156,0.3)] flex items-center justify-center hover:scale-105 hover:rotate-90 transition-all duration-300 z-40"
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
