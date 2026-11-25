import type { FinanceTotals } from '../../../types/dashboard'
import { formatCurrency } from '../../../utils/currency'
import { BalanceCard } from './balanceCard'

function TrendIcon({ positive }: { positive: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={positive ? 'trend-up' : 'trend-down'}>
      <path d={positive ? 'M3 11 7 7l2.5 2.5L13 5M9 5h4v4' : 'M3 5l4 4 2.5-2.5L13 11M9 11h4V7'} />
    </svg>
  )
}

export function SummaryCards({ totals }: { totals: FinanceTotals }) {
  return (
    <section className="summary-grid" aria-label="Resumo financeiro">
      <BalanceCard balance={totals.balance} trendLabel="Saldo liquido do periodo selecionado" />
      <article className="summary-card">
        <div className="summary-card-head">
          <span>Receitas</span>
          <div className="card-icon income-icon">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 12 4-4 3 3 4-5M12 6h4v4" /></svg>
          </div>
        </div>
        <strong>{formatCurrency(totals.income)}</strong>
        <div className="summary-trend positive"><TrendIcon positive /><span>Total do periodo selecionado</span></div>
      </article>
      <article className="summary-card">
        <div className="summary-card-head">
          <span>Despesas</span>
          <div className="card-icon expense-icon">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 8 4 4 3-3 4 5M12 14h4v-4" /></svg>
          </div>
        </div>
        <strong>{formatCurrency(totals.expenses)}</strong>
        <div className="summary-trend negative"><TrendIcon positive={false} /><span>Total do periodo selecionado</span></div>
      </article>
    </section>
  )
}