import { useState, type FormEvent } from 'react'
import { PageContainer } from '../../components/layout/page-container'
import { Button } from '../../components/ui/botoes'
import { Input } from '../../components/ui/inputs'
import { Modal } from '../../components/ui/modal'
import { useCategories } from '../../hooks/useCategories'
import { useTransactions } from '../../hooks/useTransactions'
import type { Category } from '../../types/category'
import { calculateCategoryTotals } from '../../utils/calculations'
import { CategoryList } from './components/categoryList'

export default function Categories() {
  const { transactions, updateTransaction } = useTransactions()
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#16834f')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false)
  const totals = calculateCategoryTotals(transactions)

  function openNewCategory() {
    setEditing(null)
    setName('')
    setColor('#16834f')
    setType('expense')
    setIsCategoryFormOpen(true)
  }

  function openEditCategory(category: Category) {
    setEditing(category)
    setName(category.name)
    setColor(category.color)
    setType(category.type)
    setIsCategoryFormOpen(true)
  }

  function saveCategory(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    if (editing) {
      updateCategory(editing.id, { name: name.trim(), color, type })
      transactions
        .filter((transaction) => transaction.category === editing.name)
        .forEach((transaction) => updateTransaction(transaction.id, {
          ...transaction,
          category: name.trim(),
        }))
    } else {
      addCategory({ name: name.trim(), color, type })
    }
    setEditing(null)
    setName('')
    setIsCategoryFormOpen(false)
  }

  function removeCategory(category: Category) {
    if (window.confirm(`Excluir a categoria "${category.name}"?`)) {
      deleteCategory(category.id)
      transactions
        .filter((transaction) => transaction.category === category.name)
        .forEach((transaction) => updateTransaction(transaction.id, {
          ...transaction,
          category: 'Outros',
        }))
    }
  }

  return (
    <PageContainer className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Organizacao financeira</p>
          <h1>Categorias</h1>
        </div>
        <Button type="button" onClick={openNewCategory}>+ Nova categoria</Button>
      </div>

      <CategoryList
        categories={categories}
        totals={totals}
        onEdit={openEditCategory}
        onDelete={removeCategory}
      />

      {isCategoryFormOpen && (
        <Modal
          title={editing ? 'Editar categoria' : 'Nova categoria'}
          eyebrow="Organizacao financeira"
          onClose={() => setIsCategoryFormOpen(false)}
        >
          <form className="transaction-form" onSubmit={saveCategory}>
            <Input label="Nome" value={name} onChange={(event) => setName(event.target.value)} required />
            <div className="form-grid">
              <label>Cor<input type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>
              <label>Tipo
                <select value={type} onChange={(event) => setType(event.target.value as 'income' | 'expense')}>
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <Button variant="secondary" type="button" onClick={() => {
                setEditing(null)
                setName('')
                setIsCategoryFormOpen(false)
              }}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Modal>
      )}
    </PageContainer>
  )
}
