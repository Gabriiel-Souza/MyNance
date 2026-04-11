import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { Transactions } from './components/Transactions'
import { Accounts } from './components/Accounts'
import { Categories } from './components/Categories'
import { Goals } from './components/Goals'
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
        <span className="ml-4 font-bold text-xl text-primary" style={{ fontFamily: 'var(--font-caveat)' }}>MyNance</span>
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
