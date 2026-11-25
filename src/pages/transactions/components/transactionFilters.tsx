import { MonthSelector } from '../../../components/ui/select'
import type { Category } from '../../../types/category'

type TransactionFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  categories: Category[]
  period: string
  onPeriodChange: (period: string) => void
}

export function TransactionFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  period,
  onPeriodChange,
}: TransactionFiltersProps) {
  return (
    <section className="filter-bar" aria-label="Filtros de transacoes">
      <label className="search-field">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </svg>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar transacao"
        />
      </label>
      <select
        className="filter-button"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        aria-label="Filtrar por categoria"
      >
        <option value="Todas">Todas categorias</option>
        {categories.map((item) => <option key={item.id}>{item.name}</option>)}
      </select>
      <MonthSelector period={period} onChange={onPeriodChange} />
    </section>
  )
}