import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { Transactions } from './components/Transactions'

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="flex bg-background min-h-screen font-inter">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      {activePage === 'dashboard' && <Dashboard />}
      {activePage === 'transactions' && <Transactions />}
      {/* Futuro: Contas e Metas */}
      {['accounts', 'goals'].includes(activePage) && (
        <div className="flex-1 p-8 ml-64 min-h-screen flex items-center justify-center text-gray-500">
          Página em construção
        </div>
      )}
    </div>
  )
}

export default App
