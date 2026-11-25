import { MonthSelector } from '../../components/ui/select'
import { PageContainer } from '../../components/layout/page-container'
import type { Page } from '../../constants/routes'
import { useTransactions } from '../../hooks/useTransactions'
import type { MonthlySummary } from '../../types/dashboard'
import { calculateTotals, filterTransactionsByMonth } from '../../utils/calculations'
import { getRecentMonths } from '../../utils/dates'
import { FinancialChart } from './components/financialChart'
import { RecentTransactions } from './components/recentTransactions'
import { SummaryCards } from './components/summaryCards'

type DashboardProps = {
  onNavigate: (page: Page) => void
  period: string
  onPeriodChange: (period: string) => void
}

function Dashboard({ onNavigate, period, onPeriodChange }: DashboardProps) {
  const { transactions } = useTransactions()
  const periodTransactions = filterTransactionsByMonth(transactions, period)
  const totals = calculateTotals(periodTransactions)
  const recentTransactions = [...periodTransactions]
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 4)

  const chartData: MonthlySummary[] = getRecentMonths(6).map((month) => {
    const monthTransactions = transactions.filter((transaction) =>
      transaction.date.startsWith(month.value),
    )
    const monthTotals = calculateTotals(monthTransactions)
    return {
      label: `${month.shortLabel} ${month.value.slice(0, 4)}`,
      month: month.value,
      income: monthTotals.income,
      expense: monthTotals.expenses,
    }
  })

  return (
    <PageContainer>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date())}</p>
          <h1>Bom dia</h1>
        </div>
        <MonthSelector period={period} onChange={onPeriodChange} />
      </div>

      <SummaryCards totals={totals} />

      <section className="dashboard-grid">
        <FinancialChart
          data={chartData}
          selectedMonth={period}
          onSelectMonth={onPeriodChange}
        />
        <RecentTransactions
          transactions={recentTransactions}
          onNavigate={onNavigate}
        />
      </section>
    </PageContainer>
  )
}

export default Dashboard
