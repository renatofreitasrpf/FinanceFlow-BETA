import { useState, type FormEvent } from 'react'
import { PageContainer } from '../../components/layout/page-container'
import { Button } from '../../components/ui/botoes'
import { Input } from '../../components/ui/inputs'
import { Modal } from '../../components/ui/modal'
import { useSavingsGoals } from '../../hooks/useSavingsGoals'
import type { SavingsGoal } from '../../types/savingsGoal'
import { formatCurrency } from '../../utils/currency'

function formatTargetDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(
    new Date(`${date}T00:00:00`),
  )
}

export default function SavingsGoals() {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal } = useSavingsGoals()
  const [editing, setEditing] = useState<SavingsGoal | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [error, setError] = useState('')

  function openNewGoal() {
    setEditing(null)
    setName('')
    setTargetAmount('')
    setTargetDate('')
    setError('')
    setIsFormOpen(true)
  }

  function openEditGoal(goal: SavingsGoal) {
    setEditing(goal)
    setName(goal.name)
    setTargetAmount(String(goal.targetAmount))
    setTargetDate(goal.targetDate)
    setError('')
    setIsFormOpen(true)
  }

  function saveGoal(event: FormEvent) {
    event.preventDefault()
    const normalizedName = name.trim()
    const parsedTargetAmount = Number(targetAmount)

    if (!normalizedName) {
      setError('Informe o nome da meta.')
      return
    }

    if (!Number.isFinite(parsedTargetAmount) || parsedTargetAmount <= 0) {
      setError('Informe um valor desejado maior que zero.')
      return
    }

    if (!targetDate) {
      setError('Informe a data desejada para concluir a meta.')
      return
    }

    const values = {
      name: normalizedName,
      targetAmount: parsedTargetAmount,
      currentAmount: editing?.currentAmount ?? 0,
      targetDate,
    }

    if (editing) {
      updateSavingsGoal(editing.id, values)
    } else {
      addSavingsGoal(values)
    }

    setIsFormOpen(false)
  }

  const sortedGoals = [...savingsGoals].sort(
    (first, second) =>
      first.targetDate.localeCompare(second.targetDate) ||
      first.name.localeCompare(second.name, 'pt-BR'),
  )

  return (
    <PageContainer className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Planejamento financeiro</p>
          <h1>Metas de economia</h1>
        </div>
        <Button type="button" onClick={openNewGoal}>
          + Nova meta
        </Button>
      </div>

      <section
        className="savings-goal-grid"
        aria-label="Metas de economia cadastradas"
      >
        {sortedGoals.map((goal) => (
          <article className="savings-goal-card" key={goal.id}>
            <div className="savings-goal-card-heading">
              <h2>{goal.name}</h2>
              <Button
                variant="secondary"
                type="button"
                onClick={() => openEditGoal(goal)}
              >
                Editar
              </Button>
            </div>
            <dl className="savings-goal-details">
              <div>
                <dt>Valor desejado</dt>
                <dd>{formatCurrency(goal.targetAmount)}</dd>
              </div>
              <div>
                <dt>Data desejada</dt>
                <dd>{formatTargetDate(goal.targetDate)}</dd>
              </div>
            </dl>
          </article>
        ))}
        {sortedGoals.length === 0 && (
          <div className="empty-state">
            Nenhuma meta cadastrada. Crie uma para planejar sua economia.
          </div>
        )}
      </section>

      {isFormOpen && (
        <Modal
          title={editing ? 'Editar meta' : 'Nova meta'}
          eyebrow="Planejamento financeiro"
          onClose={() => setIsFormOpen(false)}
        >
          <form className="transaction-form" onSubmit={saveGoal}>
            <Input
              label="Nome da meta"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
              placeholder="Ex: Viagem"
              required
            />
            <div className="form-grid">
              <Input
                label="Valor desejado (R$)"
                type="number"
                min="0.01"
                step="0.01"
                value={targetAmount}
                onChange={(event) => {
                  setTargetAmount(event.target.value)
                  setError('')
                }}
                required
              />
              <Input
                label="Data desejada"
                type="date"
                value={targetDate}
                onChange={(event) => {
                  setTargetDate(event.target.value)
                  setError('')
                }}
                required
              />
            </div>
            {error && (
              <span className="form-error" role="alert">
                {error}
              </span>
            )}
            <div className="modal-actions">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setIsFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar meta</Button>
            </div>
          </form>
        </Modal>
      )}
    </PageContainer>
  )
}
