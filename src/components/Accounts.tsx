import { Plus, CreditCard, Wallet, Landmark } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';

export function Accounts() {
  const { accounts } = useFinanceStore();

  const creditCards = accounts.filter(a => a.type === 'CREDIT');
  const bankAccounts = accounts.filter(a => a.type === 'DEBIT');
  const cashAccounts = accounts.filter(a => a.type === 'CASH');

  return (
    <div className="flex-1 p-8 ml-64 min-h-screen bg-background text-white">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>Suas Contas</h2>
          <p className="text-gray-400 mt-1">Gerencie saldos e faturas ativas</p>
        </div>
        
        <button className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest px-4 py-2 rounded-xl transition-colors font-medium">
          <Plus size={18} />
          <span>Nova Conta</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Lado Esquerdo: Dinheiro e Corrente */}
        <div className="flex flex-col gap-8">
          
          <section>
            <h3 className="text-xl font-bold mb-4 tracking-wide flex items-center gap-2">
              <Wallet className="text-primary" size={24} />
              Minha Carteira
            </h3>
            {cashAccounts.length === 0 ? (
              <p className="text-gray-500">Nenhum registro de dinheiro em espécie.</p>
            ) : (
              cashAccounts.map(account => (
                <div key={account.id} className="bg-surface-container-low p-6 rounded-3xl flex justify-between items-center transition-all hover:bg-surface-container-high cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{account.name}</h4>
                    <p className="text-sm text-gray-400">Dinheiro Físico</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-jakarta)'}}>
                      R$ {account.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 tracking-wide flex items-center gap-2">
              <Landmark className="text-secondary" size={24} />
              Contas Bancárias
            </h3>
            <div className="flex flex-col gap-4">
              {bankAccounts.length === 0 ? (
                <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high border-dashed text-center">
                  <p className="text-gray-500">Nenhuma conta corrente cadastrada.</p>
                </div>
              ) : (
                bankAccounts.map(account => (
                  <div key={account.id} className="bg-surface-container-low p-6 rounded-3xl flex justify-between items-center transition-all hover:bg-surface-container-high cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
                        <Landmark size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{account.name}</h4>
                        <p className="text-sm text-gray-400">Saldo Disponível</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-jakarta)'}}>
                        R$ {account.balance.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>

        {/* Lado Direito: Cartões de Crédito */}
        <div className="flex flex-col gap-8">
          <section>
            <h3 className="text-xl font-bold mb-4 tracking-wide flex items-center gap-2">
              <CreditCard className="text-tertiary" size={24} />
              Cartões de Crédito
            </h3>
            
            <div className="flex flex-col gap-6">
              {creditCards.length === 0 ? (
                <p className="text-gray-500">Nenhum cartão de crédito cadastrado.</p>
              ) : (
                creditCards.map(account => {
                  const used = Math.abs(account.balance);
                  const limit = account.limit || 0;
                  const available = limit - used;
                  const progress = limit > 0 ? (used / limit) * 100 : 0;
                  
                  return (
                    <div key={account.id} className="relative bg-surface-container-low rounded-3xl p-6 overflow-hidden transition-all hover:bg-surface-container-high cursor-pointer shadow-[0_4px_32px_rgba(0,0,0,0.3)] group">
                      
                      {/* Glow de fundo (Glassmorphism highlight) */}
                      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: account.color || '#ff7765' }} />

                      <div className="flex justify-between items-start mb-6 z-10 relative">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-jakarta)'}}>{account.name}</h4>
                          <p className="text-sm text-gray-400">Limite Disp: <span className="text-white font-medium">R$ {available.toFixed(2)}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400 mb-1">Fatura Atual</p>
                          <p className="text-3xl font-bold text-tertiary" style={{ fontFamily: 'var(--font-jakarta)'}}>R$ {used.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Barra de Progresso */}
                      <div className="relative z-10 mb-6">
                        <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                          <span>0%</span>
                          <span>{progress.toFixed(0)}% Utilizado</span>
                        </div>
                        <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${progress}%`,
                              background: `linear-gradient(90deg, ${account.color || '#ff7765'}EE 0%, ${account.color || '#ff7765'} 100%)`
                            }} 
                          />
                        </div>
                      </div>

                      {/* Régua de Fechamento / Vencimento */}
                      <div className="relative z-10 bg-surface-container-highest rounded-2xl p-4 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Fechamento</p>
                          <p className="text-sm font-bold text-white">Dia 25</p>
                        </div>
                        <div className="w-px h-8 bg-surface-variant" />
                        <div className="text-right">
                          <p className="text-xs text-gray-400 mb-1">Vencimento</p>
                          <p className="text-sm font-bold text-white">Dia 05</p>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
