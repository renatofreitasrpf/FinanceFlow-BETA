import type { Transaction } from '../types/transaction'

export const initialTransactions: Transaction[] = [
  { id: '1', name: 'Mercado Verde', category: 'Alimentacao', date: '2026-11-24', account: 'Conta corrente', amount: 286.40, type: 'expense' },
  { id: '2', name: 'Salario', category: 'Renda', date: '2026-11-22', account: 'Conta corrente', amount: 5500, type: 'income' },
  { id: '3', name: 'Conta de luz', category: 'Moradia', date: '2026-11-20', account: 'Conta corrente', amount: 184.72, type: 'expense' },
  { id: '4', name: 'Netflix', category: 'Entretenimento', date: '2026-11-18', account: 'Cartao', amount: 39.90, type: 'expense' },
  { id: '5', name: 'Freelance', category: 'Renda', date: '2026-11-15', account: 'Conta corrente', amount: 1200, type: 'income' },
]