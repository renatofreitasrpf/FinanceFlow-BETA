import { Button } from '../../../components/ui/botoes'
import type { Page } from '../../../constants/routes'
import type { Transaction } from '../../../types/transaction'
import { formatCurrency } from '../../../utils/currency'
import { Card } from '../../../components/ui/cards'

type RecentTransactionsProps = {
  transactions: Transaction[]
  onNavigate: (page: Page) => void
}

export function RecentTransactions({ transactions, onNavigate }: RecentTransactionsProps) {
  function formatDate(date: string) {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
      .format(new Date(`${date}T12:00:00`))
      .replace('.', '')
  }

  return (
    <Card className="transactions-panel">
      <div className="panel-heading">
        <div><h2>Transacoes recentes</h2><p>Ultimos movimentos</p></div>
        <Button variant="text" type="button" onClick={() => onNavigate('transactions')}>Ver todas</Button>
      </div>
      <div className="transaction-list">
        {transactions.map((transaction) => (
          <div className="transaction-row" key={transaction.id}>
            <div className={`transaction-icon ${transaction.type}`}>{transaction.name.charAt(0).toUpperCase()}</div>
            <div className="transaction-info">
              <strong>{transaction.name}</strong>
              <span>{transaction.category}</span>
            </div>
            <div className="transaction-value">
              <strong className={transaction.type === 'income' ? 'income-text' : ''}>
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </strong>
              <span>{formatDate(transaction.date)}</span>
            </div>
          </div>
        ))}
        {transactions.length === 0 && <div className="empty-state">Nenhuma transacao neste periodo.</div>}
      </div>
    </Card>
  )
}