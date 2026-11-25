import type { Category } from '../types/category'

export const defaultCategories: Category[] = [
  { id: '1', name: 'Alimentacao', color: '#16834f', type: 'expense' },
  { id: '2', name: 'Moradia', color: '#69aeda', type: 'expense' },
  { id: '3', name: 'Transporte', color: '#efad66', type: 'expense' },
  { id: '4', name: 'Entretenimento', color: '#9e7bd8', type: 'expense' },
  { id: '5', name: 'Saude', color: '#e87979', type: 'expense' },
  { id: '6', name: 'Renda', color: '#48af7a', type: 'income' },
]

export const categoryTypeLabels = {
  income: 'Receita',
  expense: 'Despesa',
} as const