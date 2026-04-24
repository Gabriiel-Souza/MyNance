import { useState } from 'react'
import { Sidebar } from './shared/components/Sidebar'
import { Dashboard } from './features/dashboard/components/Dashboard'
import { Transactions } from './features/transactions/components/Transactions'
import { Accounts } from './features/accounts/components/Accounts'
import { Categories } from './features/categories/components/Categories'
import { Goals } from './features/goals/components/Goals'
import { Menu } from 'lucide-react'

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-background min-h-screen font-inter">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-white/5 z-30 flex items-center px-6 md:hidden">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8 rounded-lg shadow-neon" />
          <span className="font-bold text-xl text-primary" style={{ fontFamily: 'var(--font-caveat)' }}>MyNance</span>
        </div>
      </header>

      <Sidebar 
        activePage={activePage} 
        onNavigate={setActivePage} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 flex flex-col min-w-0 md:ml-64 pt-16 md:pt-0">
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'transactions' && <Transactions />}
        {activePage === 'accounts' && <Accounts />}
        {activePage === 'categories' && <Categories />}
        {activePage === 'goals' && <Goals />}
      </main>
    </div>
  )
}

export default App
