import { useState, type FormEvent } from 'react'
import { PageContainer } from '../../components/layout/page-container'
import { Button } from '../../components/ui/botoes'
import { Input } from '../../components/ui/inputs'
import { Modal } from '../../components/ui/modal'
import { useSavingsGoals } from '../../hooks/useSavingsGoals'
import type { SavingsGoal } from '../../types/savingsGoal'
import { formatCurrency } from '../../utils/currency'
import { calculateSavingsGoalProgress } from '../../utils/calculations'

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
  const [currentAmount, setCurrentAmount] = useState('0')
  const [targetDate, setTargetDate] = useState('')
  const [error, setError] = useState('')

  function openNewGoal() {
    setEditing(null)
    setName('')
    setTargetAmount('')
    setCurrentAmount('0')
    setTargetDate('')
    setError('')
    setIsFormOpen(true)
  }

  function openEditGoal(goal: SavingsGoal) {
    setEditing(goal)
    setName(goal.name)
    setTargetAmount(String(goal.targetAmount))
    setCurrentAmount(String(goal.currentAmount))
    setTargetDate(goal.targetDate)
    setError('')
    setIsFormOpen(true)
  }

  function saveGoal(event: FormEvent) {
    event.preventDefault()
    const normalizedName = name.trim()
    const parsedTargetAmount = Number(targetAmount)
    const parsedCurrentAmount = Number(currentAmount)

    if (!normalizedName) {
      setError('Informe o nome da meta.')
      return
    }

    if (!Number.isFinite(parsedTargetAmount) || parsedTargetAmount <= 0) {
      setError('Informe um valor desejado maior que zero.')
      return
    }

    if (!Number.isFinite(parsedCurrentAmount) || parsedCurrentAmount < 0) {
      setError('Informe um valor guardado igual ou maior que zero.')
      return
    }

    if (!targetDate) {
      setError('Informe a data desejada para concluir a meta.')
      return
    }

    const values = {
      name: normalizedName,
      targetAmount: parsedTargetAmount,
      currentAmount: parsedCurrentAmount,
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
        {sortedGoals.map((goal) => {
          const progress = calculateSavingsGoalProgress(goal)
          const percentage = new Intl.NumberFormat('pt-BR', {
            maximumFractionDigits: 1,
          }).format(progress.percentageComplete)

          return (
            <article
              className={`savings-goal-card ${progress.isComplete ? 'goal-complete' : ''}`}
              key={goal.id}
            >
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
              <div className="savings-goal-progress">
                <div className="savings-goal-progress-label">
                  <span>
                    {formatCurrency(goal.currentAmount)} de{' '}
                    {formatCurrency(goal.targetAmount)}
                  </span>
                  <strong>{percentage}%</strong>
                </div>
                <div
                  className="savings-goal-progress-track"
                  role="progressbar"
                  aria-label={`Progresso da meta ${goal.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress.progressPercentage}
                  aria-valuetext={`${percentage}% do valor desejado`}
                >
                  <div
                    className={`savings-goal-progress-fill ${progress.isComplete ? 'complete' : ''}`}
                    style={{ width: `${progress.progressPercentage}%` }}
                  />
                </div>
                <p className="savings-goal-remaining">
                  {progress.isComplete
                    ? 'Meta alcancada'
                    : `Faltam ${formatCurrency(progress.remaining)}`}
                </p>
              </div>
            </article>
          )
        })}
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
                label="Valor guardado (R$)"
                type="number"
                min="0"
                step="0.01"
                value={currentAmount}
                onChange={(event) => {
                  setCurrentAmount(event.target.value)
                  setError('')
                }}
                required
              />
            </div>
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
