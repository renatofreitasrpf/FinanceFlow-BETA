export type Page =
  | 'dashboard'
  | 'transactions'
  | 'categories'
  | 'reports'
  | 'accounts'
  | 'budgets'
  | 'savingsGoals'

export const pageItems: { label: string; icon: string; page: Page }[] = [
  { label: 'Visao geral', icon: 'grid', page: 'dashboard' },
  { label: 'Transacoes', icon: 'wallet', page: 'transactions' },
  { label: 'Categorias', icon: 'categories', page: 'categories' },
  { label: 'Relatorios', icon: 'report', page: 'reports' },
  { label: 'Contas', icon: 'bank', page: 'accounts' },
  { label: 'Orcamentos', icon: 'budget', page: 'budgets' },
  { label: 'Metas de economia', icon: 'goal', page: 'savingsGoals' },
]