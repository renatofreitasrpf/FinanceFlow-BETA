import type { Transaction } from '../../../types/transaction'
import { formatCurrency } from '../../../utils/currency'

type TransactionListProps = {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  function formatDate(date: string) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(`${date}T12:00:00`))
  }

  return (
    <section className="table-panel" aria-label="Lista de transacoes">
      <div className="table-header">
        <span>Descricao</span><span>Categoria</span><span>Conta</span><span>Data</span><span>Valor</span>
      </div>
      {transactions.map((transaction) => (
        <div className="table-row" key={transaction.id}>
          <div className="table-description">
            <div className={`transaction-icon ${transaction.type}`}>{transaction.name.charAt(0).toUpperCase()}</div>
            <strong>{transaction.name}</strong>
          </div>
          <span>{transaction.category}</span>
          <span>{transaction.account}</span>
          <span>{formatDate(transaction.date)}</span>
          <div className="table-actions">
            <strong className={transaction.type === 'income' ? 'income-text table-value' : 'table-value'}>
              {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </strong>
            <button type="button" onClick={() => onEdit(transaction)}>Editar</button>
            <button type="button" onClick={() => onDelete(transaction)}>Excluir</button>
          </div>
        </div>
      ))}
      {transactions.length === 0 && <div className="empty-state">Nenhuma transacao encontrada.</div>}
    </section>
  )
}