import { formatCurrency } from '../../../utils/currency'

type BalanceCardProps = {
  balance: number
  trendLabel: string
}

export function BalanceCard({ balance, trendLabel }: BalanceCardProps) {
  return (
    <article className="summary-card balance-card">
      <div className="summary-card-head">
        <span>Saldo atual</span>
        <button type="button" aria-label="Mais opcoes">...</button>
      </div>
      <strong>{formatCurrency(balance)}</strong>
      <div className="summary-trend positive">
        <svg viewBox="0 0 16 16" aria-hidden="true" className="trend-up">
          <path d="M3 11 7 7l2.5 2.5L13 5M9 5h4v4" />
        </svg>
        <span>{trendLabel}</span>
      </div>
    </article>
  )
}