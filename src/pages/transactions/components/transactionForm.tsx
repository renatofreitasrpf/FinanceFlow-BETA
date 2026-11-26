import { useEffect, useState, type FormEvent } from 'react'
import type { Transaction, TransactionType } from '../../../types/transaction'
import { useCategories } from '../../../hooks/useCategories'
import { useAccounts } from '../../../hooks/useAccounts'
import { Modal } from '../../../components/ui/modal'
import { Button } from '../../../components/ui/botoes'
import type { RecurrenceFrequency } from '../../../types/recurringTransaction'

type TransactionFormProps = {
  transaction?: Transaction | null
  onSave: (
    transaction: Omit<Transaction, 'id'>,
    frequency?: RecurrenceFrequency,
  ) => void
  onClose: () => void
}

export function TransactionForm({ transaction, onSave, onClose }: TransactionFormProps) {
  const { categories } = useCategories()
  const { accounts } = useAccounts()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Alimentacao')
  const [date, setDate] = useState('2026-11-25')
  const [account, setAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [isRecurring, setIsRecurring] = useState(false)
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('monthly')

  useEffect(() => {
    if (!transaction) {
      setName('')
      setCategory(categories[0]?.name ?? '')
      setDate(new Date().toISOString().slice(0, 10))
      setAccount(accounts[0]?.name ?? '')
      setAmount('')
      setType('expense')
      setIsRecurring(false)
      setFrequency('monthly')
      return
    }
    setName(transaction.name)
    setCategory(transaction.category)
    setDate(transaction.date)
    setAccount(transaction.account)
    setAmount(String(transaction.amount))
    setType(transaction.type)
    setIsRecurring(false)
    setFrequency('monthly')
  }, [transaction, accounts, categories])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsedAmount = Number(amount.replace(',', '.'))
    if (!name.trim() || !date || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return

    onSave({
      name: name.trim(),
      category,
      date,
      account,
      amount: parsedAmount,
      type,
    }, isRecurring ? frequency : undefined)
  }

  return (
    <Modal
      title={transaction ? 'Editar transacao' : 'Nova transacao'}
      eyebrow="Movimento financeiro"
      onClose={onClose}
    >
        <form className="transaction-form" onSubmit={handleSubmit}>
          <label>Descricao<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex: Supermercado" required /></label>
          <div className="form-grid">
            <label>Valor<input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" placeholder="0,00" required /></label>
            <label>Data<input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label>
          </div>
          <div className="form-grid">
            <label>Categoria<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item.id}>{item.name}</option>)}</select></label>
            <label>Conta<select value={account} onChange={(event) => setAccount(event.target.value)} required disabled={accounts.length === 0}><option value="">Selecione uma conta</option>{accounts.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label>
          </div>
          <fieldset>
            <legend>Tipo</legend>
            <div className="type-options">
              <label><input type="radio" name="type" checked={type === 'expense'} onChange={() => setType('expense')} />Despesa</label>
              <label><input type="radio" name="type" checked={type === 'income'} onChange={() => setType('income')} />Receita</label>
            </div>
          </fieldset>
          {!transaction && (
            <fieldset className="recurrence-fieldset">
              <legend>Recorrencia</legend>
              <label className="recurrence-toggle">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(event) => setIsRecurring(event.target.checked)}
                />
                Repetir esta transacao
              </label>
              {isRecurring && (
                <label className="recurrence-frequency">
                  Frequencia
                  <select
                    value={frequency}
                    onChange={(event) => {
                      const selectedFrequency = event.target.value
                      if (
                        selectedFrequency === 'weekly' ||
                        selectedFrequency === 'monthly' ||
                        selectedFrequency === 'yearly'
                      ) {
                        setFrequency(selectedFrequency)
                      }
                    }}
                  >
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </label>
              )}
            </fieldset>
          )}
          <div className="modal-actions">
            <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar transacao</Button>
          </div>
        </form>
    </Modal>
  )
}