import { useState, type FormEvent } from 'react'
import { PageContainer } from '../../components/layout/page-container'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/botoes'
import { Input } from '../../components/ui/inputs'
import { Modal } from '../../components/ui/modal'
import { useBudgets } from '../../hooks/useBudgets'
import { useCategories } from '../../hooks/useCategories'
import type { Budget } from '../../types/budget'
import { formatCurrency } from '../../utils/currency'
import { getMonthKey } from '../../utils/dates'

function formatMonth(month: string) {
  const [year, monthNumber] = month.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, monthNumber - 1, 1))
}

export default function Budgets() {
  const { budgets, addBudget, updateBudget, deleteBudget } = useBudgets()
  const { categories } = useCategories()
  const expenseCategories = categories.filter(
    (category) => category.type === 'expense',
  )
  const [editing, setEditing] = useState<Budget | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [category, setCategory] = useState('')
  const [month, setMonth] = useState(getMonthKey(new Date()))
  const [limit, setLimit] = useState('')
  const [error, setError] = useState('')

  function openNewBudget() {
    setEditing(null)
    setCategory(expenseCategories[0]?.name ?? '')
    setMonth(getMonthKey(new Date()))
    setLimit('')
    setError('')
    setIsFormOpen(true)
  }

  function openEditBudget(budget: Budget) {
    setEditing(budget)
    setCategory(budget.category)
    setMonth(budget.month)
    setLimit(String(budget.limit))
    setError('')
    setIsFormOpen(true)
  }

  function saveBudget(event: FormEvent) {
    event.preventDefault()
    const parsedLimit = Number(limit)

    if (
      !category ||
      !month ||
      !Number.isFinite(parsedLimit) ||
      parsedLimit <= 0
    ) {
      setError('Informe uma categoria, um mes e um limite maior que zero.')
      return
    }

    const alreadyExists = budgets.some(
      (budget) =>
        budget.id !== editing?.id &&
        budget.month === month &&
        budget.category.toLocaleLowerCase() === category.toLocaleLowerCase(),
    )
    if (alreadyExists) {
      setError('Ja existe um orcamento para essa categoria neste mes.')
      return
    }

    const values = { category, month, limit: parsedLimit }
    if (editing) {
      updateBudget(editing.id, values)
    } else {
      addBudget(values)
    }
    setIsFormOpen(false)
  }

  function removeBudget(budget: Budget) {
    if (
      window.confirm(
        `Excluir o orcamento de "${budget.category}" para ${formatMonth(budget.month)}?`,
      )
    ) {
      deleteBudget(budget.id)
    }
  }

  const sortedBudgets = [...budgets].sort(
    (first, second) =>
      second.month.localeCompare(first.month) ||
      first.category.localeCompare(second.category, 'pt-BR'),
  )

  return (
    <PageContainer className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Planejamento financeiro</p>
          <h1>Orcamentos</h1>
        </div>
        <Button type="button" onClick={openNewBudget}>
          + Novo orcamento
        </Button>
      </div>

      <section className="budget-grid" aria-label="Orcamentos cadastrados">
        {sortedBudgets.map((budget) => (
          <article className="budget-card" key={budget.id}>
            <div className="budget-card-heading">
              <Badge>{formatMonth(budget.month)}</Badge>
              <div className="budget-actions">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => openEditBudget(budget)}
                >
                  Editar
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => removeBudget(budget)}
                >
                  Excluir
                </Button>
              </div>
            </div>
            <h2>{budget.category}</h2>
            <p>Limite planejado</p>
            <strong>{formatCurrency(budget.limit)}</strong>
          </article>
        ))}
        {sortedBudgets.length === 0 && (
          <div className="empty-state">
            Nenhum orcamento cadastrado. Crie um para definir limites por
            categoria e mes.
          </div>
        )}
      </section>

      {isFormOpen && (
        <Modal
          title={editing ? 'Editar orcamento' : 'Novo orcamento'}
          eyebrow="Planejamento financeiro"
          onClose={() => setIsFormOpen(false)}
        >
          <form className="transaction-form" onSubmit={saveBudget}>
            <label>
              Categoria de despesa
              <select
                className="field-input"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value)
                  setError('')
                }}
                required
              >
                {!category && <option value="">Selecione uma categoria</option>}
                {editing &&
                  !expenseCategories.some(
                    (item) => item.name === editing.category,
                  ) && (
                    <option value={editing.category}>
                      {editing.category} (indisponivel)
                    </option>
                  )}
                {expenseCategories.map((item) => (
                  <option value={item.name} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-grid">
              <Input
                label="Mes"
                type="month"
                value={month}
                onChange={(event) => {
                  setMonth(event.target.value)
                  setError('')
                }}
                required
              />
              <Input
                label="Limite (R$)"
                type="number"
                min="0.01"
                step="0.01"
                value={limit}
                onChange={(event) => {
                  setLimit(event.target.value)
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
              <Button type="submit">Salvar orcamento</Button>
            </div>
          </form>
        </Modal>
      )}
    </PageContainer>
  )
}
