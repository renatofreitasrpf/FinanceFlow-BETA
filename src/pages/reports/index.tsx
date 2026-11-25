import { useTransactions } from '../../hooks/useTransactions'
import { calculateCategoryTotals, calculateTotals, filterTransactionsByMonth } from '../../utils/calculations'
import { MonthSelector } from '../../components/ui/select'
import { PageContainer } from '../../components/layout/page-container'
import { ReportsChart, type ReportCategory } from './components/reportsChart'

const colors = ['#16834f', '#69aeda', '#efad66', '#9e7bd8', '#e87979', '#b8c1bb']

export default function Reports({
  period,
  onPeriodChange,
}: {
  period: string
  onPeriodChange: (period: string) => void
}) {
  const { transactions } = useTransactions()
  const periodTransactions = filterTransactionsByMonth(transactions, period)
  const totals = calculateTotals(periodTransactions)
  const expenses = calculateCategoryTotals(
    periodTransactions.filter((transaction) => transaction.type === 'expense'),
  )
  const categories: ReportCategory[] = expenses.map((category, index) => ({
    ...category,
    color: colors[index % colors.length],
    value: totals.expenses
      ? Math.round((category.amount / totals.expenses) * 100)
      : 0,
  }))

  function exportCsv() {
    const header = 'Categoria,Quantidade,Valor,Percentual\n'
    const rows = categories.map((category) =>
      `${category.name},${category.count},${category.amount.toFixed(2).replace('.', ',')},${category.value}%`,
    )
    const blob = new Blob([header + rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'financeflow-relatorio.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageContainer className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Analise do periodo</p>
          <h1>Relatorios</h1>
        </div>
        <MonthSelector period={period} onChange={onPeriodChange} />
      </div>

      <ReportsChart
        totalExpenses={totals.expenses}
        categories={categories}
        onExport={exportCsv}
      />
    </PageContainer>
  )
}
