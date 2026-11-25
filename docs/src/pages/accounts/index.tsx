import { useState, type FormEvent } from 'react'
import { useAccounts } from '../../hooks/useAccounts'
import { useTransactions } from '../../hooks/useTransactions'
import type { Account, AccountType } from '../../types/account'
import { calculateAccountBalance } from '../../utils/calculations'
import { PageContainer } from '../../components/layout/page-container'
import { Button } from '../../components/ui/botoes'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/inputs'
import { Modal } from '../../components/ui/modal'
import { formatCurrency } from '../../utils/currency'

const accountTypeLabels: Record<AccountType, string> = {
  checking: 'Conta corrente',
  savings: 'Poupanca',
  credit: 'Cartao de credito',
  cash: 'Dinheiro',
}

export default function Accounts() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts()
  const { transactions, updateTransaction } = useTransactions()
  const [editing, setEditing] = useState<Account | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<AccountType>('checking')
  const [color, setColor] = useState('#16834f')
  const [error, setError] = useState('')

  function openNewAccount() {
    setEditing(null)
    setName('')
    setType('checking')
    setColor('#16834f')
    setError('')
    setIsFormOpen(true)
  }

  function openEditAccount(account: Account) {
    setEditing(account)
    setName(account.name)
    setType(account.type)
    setColor(account.color)
    setError('')
    setIsFormOpen(true)
  }

  function saveAccount(event: FormEvent) {
    event.preventDefault()
    const normalizedName = name.trim()

    if (!normalizedName) {
      setError('Informe o nome da conta.')
      return
    }

    if (accounts.some((account) =>
      account.id !== editing?.id && account.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase(),
    )) {
      setError('Ja existe uma conta com esse nome.')
      return
    }

    if (editing) {
      updateAccount(editing.id, { name: normalizedName, type, color })
      if (editing.name !== normalizedName) {
        transactions
          .filter((transaction) => transaction.account === editing.name)
          .forEach((transaction) => updateTransaction(transaction.id, {
            ...transaction,
            account: normalizedName,
          }))
      }
    } else {
      addAccount({ name: normalizedName, type, color })
    }
    setIsFormOpen(false)
  }

  function removeAccount(account: Account) {
    const linkedTransactions = transactions.filter(
      (transaction) => transaction.account === account.name,
    )
    if (linkedTransactions.length > 0) return
    if (window.confirm(`Excluir a conta "${account.name}"?`)) {
      deleteAccount(account.id)
    }
  }

  return (
    <PageContainer className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Suas carteiras financeiras</p>
          <h1>Contas</h1>
        </div>
        <Button type="button" onClick={openNewAccount}>
          + Nova conta
        </Button>
      </div>

      <section className="account-grid" aria-label="Contas cadastradas">
        {accounts.map((account) => {
          const linkedCount = transactions.filter(
            (transaction) => transaction.account === account.name,
          ).length
          const balance = calculateAccountBalance(account.name, transactions)
          const canDelete = linkedCount === 0

          return (
            <article className="account-card" key={account.id}>
              <div className="account-card-head">
                <div className="account-icon" style={{ backgroundColor: `${account.color}18`, color: account.color }}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <path d="M3 10h18M7 15h3" />
                  </svg>
                </div>
                <div className="account-actions">
                  <Button variant="secondary" type="button" onClick={() => openEditAccount(account)}>Editar</Button>
                  <Button
                    variant="secondary"
                    type="button"
                    disabled={!canDelete}
                    title={canDelete ? 'Excluir conta' : 'Mova ou exclua as transacoes vinculadas antes'}
                    onClick={() => removeAccount(account)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
              <h2>{account.name}</h2>
              <p><Badge>{accountTypeLabels[account.type]}</Badge> · {linkedCount} transacoes</p>
              <strong className={balance >= 0 ? 'income-text' : 'expense-text'}>
                {formatCurrency(balance)}
              </strong>
              {!canDelete && <small>Conta vinculada a transacoes e protegida contra exclusao.</small>}
            </article>
          )
        })}
        {accounts.length === 0 && (
          <div className="empty-state">Nenhuma conta cadastrada. Crie uma para registrar transacoes.</div>
        )}
      </section>

      {isFormOpen && (
        <Modal
          title={editing ? 'Editar conta' : 'Nova conta'}
          eyebrow="Carteira financeira"
          onClose={() => setIsFormOpen(false)}
        >
          <form className="transaction-form" onSubmit={saveAccount}>
            <Input
              label="Nome da conta"
              value={name}
              onChange={(event) => { setName(event.target.value); setError('') }}
              placeholder="Ex: Conta principal"
              error={error}
              required
            />
            <div className="form-grid">
              <label>Tipo
                <select value={type} onChange={(event) => setType(event.target.value as AccountType)}>
                  {Object.entries(accountTypeLabels).map(([value, label]) => (
                    <option value={value} key={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label>Cor<input type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>
            </div>
            <div className="modal-actions">
              <Button variant="secondary" type="button" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar conta</Button>
            </div>
          </form>
        </Modal>
      )}
    </PageContainer>
  )
}
