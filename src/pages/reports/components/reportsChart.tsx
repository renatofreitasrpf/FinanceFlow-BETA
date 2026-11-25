import { Card } from '../../../components/ui/cards'
import { formatCurrency } from '../../../utils/currency'

export interface ReportCategory {
  name: string
  count: number
  amount: number
  color: string
  value: number
}

type ReportsChartProps = {
  totalExpenses: number
  categories: ReportCategory[]
  onExport: () => void
}

export function ReportsChart({ totalExpenses, categories, onExport }: ReportsChartProps) {
  let start = 0
  const gradientParts = categories.map((category) => {
    const end = start + category.value
    const part = `${category.color} ${start}% ${end}%`
    start = end
    return part
  })
  const donutBackground = gradientParts.length
    ? `conic-gradient(${gradientParts.join(', ')})`
    : '#edf1ee'

  return (
    <section className="reports-grid">
      <Card className="report-chart-panel">
        <div className="panel-heading">
          <div><h2>Despesas por categoria</h2><p>Distribuicao do periodo selecionado</p></div>
          <button className="text-button" type="button" onClick={onExport}>Exportar</button>
        </div>
        <div className="donut-wrap">
          <div className="donut" style={{ background: donutBackground }} />
          <div className="donut-center"><strong>{formatCurrency(totalExpenses)}</strong><span>Total</span></div>
        </div>
      </Card>

      <Card className="report-list-panel">
        <div className="panel-heading">
          <div><h2>Detalhamento</h2><p>Despesas por categoria</p></div>
        </div>
        <div className="report-list">
          {categories.map((category) => (
            <div className="report-row" key={category.name}>
              <span className="report-dot" style={{ backgroundColor: category.color }} />
              <span>{category.name}</span>
              <strong>{formatCurrency(category.amount)}</strong>
              <span>{category.value}%</span>
            </div>
          ))}
          {categories.length === 0 && <div className="empty-state">Nenhuma despesa registrada.</div>}
        </div>
      </Card>
    </section>
  )
}