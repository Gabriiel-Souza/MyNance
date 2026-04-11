import { 
  Plus, 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  Landmark, 
  Utensils, 
  Car, 
  ShoppingBag, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import type { Transaction, TransactionType } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, editTransaction }: ModalProps) {
  const { categories, addTransaction, updateTransaction, removeTransaction, accounts } = useFinanceStore();
  
  const [type, setType] = useState<TransactionType>('OUT');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [destinationAccountId, setDestinationAccountId] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  
  // Repetition States
  const [isRepetitive, setIsRepetitive] = useState(false);
  const [repeatType, setRepeatType] = useState<'FIXED' | 'INSTALLMENT'>('FIXED');
  const [repeatCount, setRepeatCount] = useState('12');
  const [totalAmount, setTotalAmount] = useState('');

  // Dropdown States
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isDestAccountOpen, setIsDestAccountOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        setType(editTransaction.type);
        setAmount(Math.abs(editTransaction.amount).toString());
        setDesc(editTransaction.description);
        setDate(new Date(editTransaction.date).toISOString().split('T')[0]);
        setCategoryId(editTransaction.categoryId || '');
        setAccountId(editTransaction.accountId);
        setDestinationAccountId(editTransaction.destinationAccountId || '');
        setIsRepetitive(editTransaction.isRecurring);
      } else {
        setType('OUT');
        setAmount('');
        setTotalAmount('');
        setDesc('');
        setDate(new Date().toISOString().split('T')[0]);
        setCategoryId(categories[0]?.id || '');
        setAccountId(accounts[0]?.id || '');
        setDestinationAccountId('');
        setIsRepetitive(false);
        setRepeatType('FIXED');
        setRepeatCount('24');
      }
    }
  }, [isOpen, editTransaction, categories, accounts]);

  // Fecha dropdowns ao clicar fora
  useEffect(() => {
    const handleGlobalClick = () => {
      setTimeout(() => {
        setIsAccountOpen(false);
        setIsDestAccountOpen(false);
        setIsCategoryOpen(false);
      }, 0);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  if (!isOpen) return null;

  const isFormValid = () => {
    if (!amount || Number(amount) <= 0) return false;
    if (!desc.trim()) return false;
    if (!accountId) return false;
    
    if (type === 'TRANSFER') {
      return accountId !== destinationAccountId && destinationAccountId !== '';
    } else {
      return categoryId !== '';
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const handleTotalChange = (value: string) => {
    setTotalAmount(value);
    if (isRepetitive && repeatType === 'INSTALLMENT' && value) {
      const count = Number(repeatCount);
      if (count > 0) {
        setAmount((Number(value) / count).toFixed(2));
      }
    }
  };

  const handleRepeatCountChange = (value: string) => {
    setRepeatCount(value);
    if (isRepetitive && repeatType === 'INSTALLMENT' && totalAmount) {
      const count = Number(value);
      if (count > 0) {
        setAmount((Number(totalAmount) / count).toFixed(2));
      }
    }
  };

  const renderCategoryIcon = (iconName: string, size = 14) => {
    switch (iconName) {
      case 'Utensils': return <Utensils size={size} />;
      case 'Car': return <Car size={size} />;
      case 'ShoppingBag': return <ShoppingBag size={size} />;
      case 'Landmark': return <Landmark size={size} />;
      default: return <Wallet size={size} />;
    }
  };

  const getAccountIcon = (id: string) => {
    const acc = (accounts || []).find(a => a.id === id);
    if (!acc) return <Wallet size={14} />;
    return acc.type === 'CREDIT' ? <CreditCard size={14} style={{ color: acc.color }} /> : <Wallet size={14} style={{ color: acc.color }} />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      triggerShake();
      return;
    }

    const txData = {
      description: desc,
      amount: type === 'OUT' ? -Number(amount) : Number(amount),
      date: new Date(date).toISOString(),
      type,
      categoryId: type === 'TRANSFER' ? '' : categoryId,
      accountId: accountId,
      destinationAccountId: type === 'TRANSFER' ? destinationAccountId : undefined,
      isRecurring: false
    };

    if (editTransaction) {
      updateTransaction(editTransaction.id, txData);
    } else {
      const count = isRepetitive ? (repeatType === 'FIXED' ? 24 : Number(repeatCount)) : 1;
      addTransaction({
        ...txData,
        isRecurring: isRepetitive,
        installment: isRepetitive && repeatType === 'INSTALLMENT' ? { current: 1, total: Number(repeatCount) } : undefined
      }, count);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (editTransaction) {
      if (editTransaction.recurrenceId) {
        if (window.confirm('Esta é uma transação recorrente. Deseja excluir este e TODOS os lançamentos futuros?')) {
          removeTransaction(editTransaction.id, true);
        } else {
          removeTransaction(editTransaction.id, false);
        }
      } else if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
        removeTransaction(editTransaction.id, false);
      }
      onClose();
    }
  };

  const valid = isFormValid();
  const selectedAccount = (accounts || []).find(a => a.id === accountId);
  const selectedDestAccount = (accounts || []).find(a => a.id === destinationAccountId);
  const selectedCategory = (categories || []).find(c => c.id === categoryId);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#1a1a19] rounded-3xl p-8 border border-white/5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white rotate-45">
          <Plus size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6 font-plus-jakarta text-white/90">
          {editTransaction ? 'Editar Transação' : 'Nova Transação'}
        </h2>

        <div className="flex gap-2 mb-6 bg-surface-container-low p-1 rounded-xl border border-white/5">
          {(['OUT', 'IN', 'TRANSFER'] as TransactionType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2.5 px-2 text-[10px] md:text-xs font-black rounded-xl transition-all uppercase tracking-[0.1em] ${
                type === t 
                  ? t === 'OUT' ? 'bg-tertiary text-white shadow-lg shadow-tertiary/20' 
                  : t === 'IN' ? 'bg-primary text-background shadow-lg shadow-primary/20'
                  : 'bg-secondary text-background shadow-lg shadow-secondary/20'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'OUT' ? (
                <span className="flex items-center justify-center gap-1.5"><ArrowDownRight size={14} /> Despesa</span>
              ) : t === 'IN' ? (
                <span className="flex items-center justify-center gap-1.5"><ArrowUpRight size={14} /> Receita</span>
              ) : (
                <span className="flex items-center justify-center gap-1.5"><TrendingUp size={14} /> Transf.</span>
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                Descrição
              </label>
              <input 
                type="text"
                required
                value={desc}
                onChange={e => setDesc(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 font-medium text-xs focus:outline-none focus:border-primary transition-all placeholder:text-white/20"
                placeholder="Ex: Almoço, Netflix, Salário..."
                autoFocus={!editTransaction}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {isRepetitive && repeatType === 'INSTALLMENT' && (
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Valor Total da Compra
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">R$</span>
                    <input 
                      type="number"
                      step="0.01"
                      value={totalAmount}
                      onChange={e => handleTotalChange(e.target.value)}
                      className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs font-bold focus:outline-none border-dashed"
                      placeholder="Total"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                  {isRepetitive && repeatType === 'INSTALLMENT' ? 'Val. Parcela' : 'Valor'}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">R$</span>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs font-bold focus:outline-none focus:border-primary transition-all shadow-inner"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                  Data
                </label>
                <input 
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 font-bold text-xs focus:outline-none focus:border-primary transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {type !== 'TRANSFER' ? (
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Conta
                  </label>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      type="button"
                      onClick={() => setIsAccountOpen(!isAccountOpen)}
                      className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-10 py-3 font-bold text-xs text-left focus:outline-none flex items-center gap-2"
                    >
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 flex items-center justify-center w-5">
                        {getAccountIcon(accountId)}
                      </div>
                      <span className="truncate">{selectedAccount?.name || 'Selecionar...'}</span>
                      <ChevronRight size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform rotate-90 ${isAccountOpen ? 'rotate-[270deg]' : ''}`} />
                    </button>
                    
                    {isAccountOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#20201f] border border-white/10 rounded-xl shadow-2xl z-[70] overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                        {(accounts || []).map(acc => (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => { setAccountId(acc.id); setIsAccountOpen(false); }}
                            className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 text-xs font-bold transition-colors border-b border-white/5 last:border-0"
                          >
                            <span style={{ color: acc.color }}>
                              {acc.type === 'CREDIT' ? <CreditCard size={14} /> : <Wallet size={14} />}
                            </span>
                            {acc.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Origem
                  </label>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      type="button"
                      onClick={() => setIsAccountOpen(!isAccountOpen)}
                      className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-10 py-3 font-bold text-xs text-left focus:outline-none flex items-center gap-2"
                    >
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 flex items-center justify-center w-5">
                        {getAccountIcon(accountId)}
                      </div>
                      <span className="truncate">{selectedAccount?.name || 'Selecionar...'}</span>
                      <ChevronRight size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform rotate-90 ${isAccountOpen ? 'rotate-[270deg]' : ''}`} />
                    </button>
                    
                    {isAccountOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#20201f] border border-white/10 rounded-xl shadow-2xl z-[70] overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                        {(accounts || []).map(acc => (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => { setAccountId(acc.id); setIsAccountOpen(false); }}
                            className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 text-xs font-bold transition-colors border-b border-white/5 last:border-0"
                          >
                            <span style={{ color: acc.color }}>
                              {acc.type === 'CREDIT' ? <CreditCard size={14} /> : <Wallet size={14} />}
                            </span>
                            {acc.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {type === 'TRANSFER' ? (
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Destino
                  </label>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      type="button"
                      onClick={() => setIsDestAccountOpen(!isDestAccountOpen)}
                      className={`w-full bg-background border rounded-xl pl-10 pr-10 py-3 font-bold text-xs text-left focus:outline-none flex items-center gap-2 ${accountId === destinationAccountId ? 'border-tertiary' : 'border-white/10'}`}
                    >
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 flex items-center justify-center w-5">
                        {getAccountIcon(destinationAccountId)}
                      </div>
                      <span className="truncate">{selectedDestAccount?.name || 'Escolha o destino...'}</span>
                      <ChevronRight size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform rotate-90 ${isDestAccountOpen ? 'rotate-[270deg]' : ''}`} />
                    </button>
                    
                    {isDestAccountOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#20201f] border border-white/10 rounded-xl shadow-2xl z-[70] overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                        {(accounts || []).filter(acc => acc.id !== accountId).map(acc => (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => { setDestinationAccountId(acc.id); setIsDestAccountOpen(false); }}
                            className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 text-xs font-bold transition-colors border-b border-white/5 last:border-0"
                          >
                            <span style={{ color: acc.color }}>
                              {acc.type === 'CREDIT' ? <CreditCard size={14} /> : <Wallet size={14} />}
                            </span>
                            {acc.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Categoria
                  </label>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      type="button"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-10 py-3 font-bold text-xs text-left focus:outline-none flex items-center gap-2"
                    >
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 flex items-center justify-center w-5" style={{ color: selectedCategory?.color || 'currentColor' }}>
                        {renderCategoryIcon(selectedCategory?.icon || 'Wallet')}
                      </div>
                      <span className="truncate">{selectedCategory?.label || 'Buscar categoria...'}</span>
                      <ChevronRight size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform rotate-90 ${isCategoryOpen ? 'rotate-[270deg]' : ''}`} />
                    </button>
                    
                    {isCategoryOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#20201f] border border-white/10 rounded-xl shadow-2xl z-[70] overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                        {(categories || []).map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => { setCategoryId(cat.id); setIsCategoryOpen(false); }}
                            className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 text-xs font-bold transition-colors border-b border-white/5 last:border-0"
                          >
                            <span style={{ color: cat.color }}>
                              {renderCategoryIcon(cat.icon)}
                            </span>
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!editTransaction && type !== 'TRANSFER' && (
            <div className="bg-surface-container-low/30 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className={isRepetitive ? 'text-primary' : 'text-gray-500'} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isRepetitive ? 'text-white' : 'text-gray-500'}`}>Repetir Lançamento</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsRepetitive(!isRepetitive)}
                  className={`w-10 h-5 rounded-full relative transition-all ${isRepetitive ? 'bg-primary' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isRepetitive ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {isRepetitive && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRepeatType('FIXED')}
                      className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${repeatType === 'FIXED' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                    >
                      Fixo
                    </button>
                    <button
                      type="button"
                      onClick={() => setRepeatType('INSTALLMENT')}
                      className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${repeatType === 'INSTALLMENT' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                    >
                      Parcelado
                    </button>
                  </div>

                  {repeatType === 'INSTALLMENT' && (
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Parcelas:</span>
                      <input 
                        type="number"
                        min="2"
                        value={repeatCount}
                        onChange={e => handleRepeatCountChange(e.target.value)}
                        className="w-16 bg-background border border-white/10 rounded-lg px-2 py-1 text-center font-bold text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button 
              type="submit"
              onClick={!valid ? triggerShake : undefined}
              className={`w-12 h-12 rounded-full bg-primary text-background self-center flex items-center justify-center shadow-lg transition-all ${!valid ? 'opacity-50 grayscale' : 'hover:scale-110 active:scale-95'} ${isShaking ? 'animate-shake' : ''}`}
            >
              <Plus size={24} strokeWidth={3} />
            </button>

            {editTransaction && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-tertiary text-[9px] font-bold uppercase tracking-widest hover:underline mt-2 opacity-50 hover:opacity-100"
              >
                Excluir Transação
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
