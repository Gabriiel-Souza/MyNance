import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { Transactions } from './components/Transactions'
import { Accounts } from './components/Accounts'
import { Categories } from './components/Categories'
import { Goals } from './components/Goals'

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="flex bg-background min-h-screen font-inter">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      {activePage === 'dashboard' && <Dashboard />}
      {activePage === 'transactions' && <Transactions />}
      {activePage === 'accounts' && <Accounts />}
      {activePage === 'categories' && <Categories />}
      {activePage === 'goals' && <Goals />}
    </div>
  )
}

export default App
