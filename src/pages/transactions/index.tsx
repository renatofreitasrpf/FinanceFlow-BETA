import { useState, type ChangeEvent } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import type { Transaction } from '../../types/transaction'
import { TransactionForm } from './components/transactionForm'
import { filterTransactionsByMonth } from '../../utils/calculations'
import { useCategories } from '../../hooks/useCategories'
import { PageContainer } from '../../components/layout/page-container'
import { Button } from '../../components/ui/botoes'
import { TransactionFilters } from './components/transactionFilters'
import { TransactionList } from './components/transactionList'


export default function Transactions({
  period,
  onPeriodChange,
}: {
  period: string
  onPeriodChange: (period: string) => void
}) {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions()
  const { categories } = useCategories()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const filteredTransactions = filterTransactionsByMonth(transactions, period).filter((transaction) => {
    const matchesSearch = transaction.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'Todas' || transaction.category === category
    return matchesSearch && matchesCategory
  })

  function openNewTransaction() {
    setEditing(null)
    setIsFormOpen(true)
  }

  function openEditTransaction(transaction: Transaction) {
    setEditing(transaction)
    setIsFormOpen(true)
  }

  function saveTransaction(transaction: Omit<Transaction, 'id'>) {
    if (editing) updateTransaction(editing.id, transaction)
    else addTransaction(transaction)
    setIsFormOpen(false)
  }

  function removeTransaction(transaction: Transaction) {
    if (window.confirm(`Excluir "${transaction.name}"?`)) {
      deleteTransaction(transaction.id)
    }
  }

  function exportTransactions() {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'financeflow-transacoes.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  function importTransactions(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result)) as Transaction[]
        if (!Array.isArray(imported)) throw new Error('Formato invalido')
        const valid = imported.filter((item) =>
          item.name && item.category && item.date && item.account &&
          Number.isFinite(item.amount) && (item.type === 'income' || item.type === 'expense'),
        )
        valid.forEach((item) => addTransaction({
          name: item.name,
          category: item.category,
          date: item.date,
          account: item.account,
          amount: item.amount,
          type: item.type,
        }))
      } catch {
        window.alert('Arquivo JSON invalido.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  return (
    <PageContainer className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Controle financeiro</p>
          <h1>Transacoes</h1>
        </div>
        <div className="page-actions">
          <label className="secondary-button file-button">
            Importar
            <input type="file" accept=".json,application/json" onChange={importTransactions} />
          </label>
          <Button variant="secondary" type="button" onClick={exportTransactions}>Exportar</Button>
          <Button type="button" onClick={openNewTransaction}>+ Nova transacao</Button>
        </div>
      </div>

      <TransactionFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        period={period}
        onPeriodChange={onPeriodChange}
      />
      <TransactionList
        transactions={filteredTransactions}
        onEdit={openEditTransaction}
        onDelete={removeTransaction}
      />

      {isFormOpen && (
        <TransactionForm
          transaction={editing}
          onSave={saveTransaction}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </PageContainer>
  )
}
