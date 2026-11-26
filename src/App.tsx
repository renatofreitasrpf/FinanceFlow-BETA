import { useEffect, useState } from 'react'
import { MainLayout } from './components/layout/main-layout'
import Dashboard from './pages/dashboard'
import Transactions from './pages/transactions'
import Categories from './pages/categories'
import Reports from './pages/reports'
import Accounts from './pages/accounts'
import Budgets from './pages/budgets'
import { getMonthKey } from './utils/dates'
import type { Page } from './constants/routes'

function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [period, setPeriod] = useState(() => getMonthKey(new Date()))
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('financeflow.theme') as 'light' | 'dark') ?? 'light',
  )
  const [profileName, setProfileName] = useState(
    () => localStorage.getItem('financeflow.profile') ?? 'Renato Freitas',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('financeflow.theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('financeflow.profile', profileName)
  }, [profileName])

  function renderPage() {
    if (page === 'transactions') return <Transactions period={period} onPeriodChange={setPeriod} />
    if (page === 'categories') return <Categories />
    if (page === 'reports') return <Reports period={period} onPeriodChange={setPeriod} />
    if (page === 'accounts') return <Accounts />
    if (page === 'budgets') return <Budgets />
    return <Dashboard period={period} onPeriodChange={setPeriod} onNavigate={setPage} />
  }

  return (
    <MainLayout
      activePage={page}
      onNavigate={setPage}
      theme={theme}
      onThemeChange={setTheme}
      profileName={profileName}
      onProfileNameChange={setProfileName}
    >
      {renderPage()}
    </MainLayout>
  )
}

export default App
