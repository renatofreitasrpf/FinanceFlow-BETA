import { Badge } from '../../../components/ui/badge'
import type { Category } from '../../../types/category'
import type { CategoryTotal } from '../../../utils/calculations'
import { formatCurrency } from '../../../utils/currency'

type CategoryListProps = {
  categories: Category[]
  totals: CategoryTotal[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryList({ categories, totals, onEdit, onDelete }: CategoryListProps) {
  if (categories.length === 0) {
    return <div className="empty-state">Nenhuma categoria cadastrada.</div>
  }

  return (
    <section className="category-grid" aria-label="Categorias cadastradas">
      {categories.map((category) => {
        const total = totals.find((item) => item.name === category.name)
        return (
          <article className="category-card" key={category.id}>
            <div className="category-card-top">
              <div
                className="category-icon"
                style={{ backgroundColor: `${category.color}18`, color: category.color }}
              >
                {category.name.charAt(0)}
              </div>
              <div className="category-actions">
                <button type="button" onClick={() => onEdit(category)}>Editar</button>
                <button type="button" onClick={() => onDelete(category)}>Excluir</button>
              </div>
            </div>
            <h2>{category.name}</h2>
            <p>{total?.count ?? 0} transacoes no historico</p>
            <strong>{formatCurrency(total?.amount ?? 0)}</strong>
            <Badge variant={category.type === 'income' ? 'success' : 'expense'}>
              {category.type === 'income' ? 'Receita' : 'Despesa'}
            </Badge>
          </article>
        )
      })}
    </section>
  )
}