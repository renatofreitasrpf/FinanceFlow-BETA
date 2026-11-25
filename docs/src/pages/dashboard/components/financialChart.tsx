import { Card } from '../../../components/ui/cards'
import type { MonthlySummary } from '../../../types/dashboard'

type FinancialChartProps = {
  data: MonthlySummary[]
  selectedMonth: string
  onSelectMonth: (month: string) => void
}

export function FinancialChart({ data, selectedMonth, onSelectMonth }: FinancialChartProps) {
  const maximum = Math.max(1, ...data.flatMap((item) => [item.income, item.expense]))

  return (
    <Card className="chart-panel">
      <div className="panel-heading">
        <div><h2>Fluxo financeiro</h2><p>Receitas e despesas nos ultimos meses</p></div>
        <div className="chart-legend">
          <span><i className="legend-income" />Receitas</span>
          <span><i className="legend-expense" />Despesas</span>
        </div>
      </div>
      <div className="chart">
        <div className="chart-axis">
          <span>{new Intl.NumberFormat('pt-BR', { notation: 'compact', style: 'currency', currency: 'BRL' }).format(maximum)}</span>
          <span>{new Intl.NumberFormat('pt-BR', { notation: 'compact', style: 'currency', currency: 'BRL' }).format(maximum * .75)}</span>
          <span>{new Intl.NumberFormat('pt-BR', { notation: 'compact', style: 'currency', currency: 'BRL' }).format(maximum * .5)}</span>
          <span>{new Intl.NumberFormat('pt-BR', { notation: 'compact', style: 'currency', currency: 'BRL' }).format(maximum * .25)}</span>
          <span>R$ 0</span>
        </div>
        <div className="chart-area">
          <div className="chart-lines"><i /><i /><i /><i /><i /></div>
          <div className="bars">
            {data.map((item) => (
              <button
                className={`bar-group ${selectedMonth === item.month ? 'selected' : ''}`}
                key={item.month}
                type="button"
                aria-label={`Filtrar por ${item.label}`}
                aria-pressed={selectedMonth === item.month}
                onClick={() => onSelectMonth(item.month)}
              >
                <span className="bars-inner">
                  <span className="bar income-bar" style={{ height: `${(item.income / maximum) * 100}%` }} />
                  <span className="bar expense-bar" style={{ height: `${(item.expense / maximum) * 100}%` }} />
                </span>
                <span className="month">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}