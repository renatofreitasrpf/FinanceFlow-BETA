import { describe, expect, it } from 'vitest'
import type { Transaction } from '../types/transaction'
import {
  calculateAccountBalance,
  calculateCategoryTotals,
  calculateTotals,
  filterTransactionsByMonth,
} from './calculations'

const transactions: Transaction[] = [
  { id: '1', name: 'Salario', category: 'Renda', date: '2026-11-22', account: 'Conta corrente', amount: 5000, type: 'income' },
  { id: '2', name: 'Mercado', category: 'Alimentacao', date: '2026-11-24', account: 'Conta corrente', amount: 300, type: 'expense' },
  { id: '3', name: 'Luz', category: 'Moradia', date: '2026-11-20', account: 'Conta corrente', amount: 200, type: 'expense' },
]

describe('calculateTotals', () => {
  it('separa receitas, despesas e calcula o saldo', () => {
    expect(calculateTotals(transactions)).toEqual({
      income: 5000,
      expenses: 500,
      balance: 4500,
    })
  })

  it('retorna zero quando nao existem transacoes', () => {
    expect(calculateTotals([])).toEqual({
      income: 0,
      expenses: 0,
      balance: 0,
    })
  })
})

describe('calculateCategoryTotals', () => {
  it('agrupa transacoes por categoria e ordena pelo maior valor', () => {
    expect(calculateCategoryTotals(transactions)).toEqual([
      { name: 'Renda', count: 1, amount: 5000 },
      { name: 'Alimentacao', count: 1, amount: 300 },
      { name: 'Moradia', count: 1, amount: 200 },
    ])
  })
})

describe('filterTransactionsByMonth', () => {
  it('retorna todo o historico quando nenhum mes e selecionado', () => {
    expect(filterTransactionsByMonth(transactions, '')).toEqual(transactions)
  })

  it('retorna somente as transacoes do mes selecionado', () => {
    expect(filterTransactionsByMonth(transactions, '2026-11')).toEqual(transactions)
    expect(filterTransactionsByMonth(transactions, '2026-10')).toEqual([])
  })
})

describe('calculateAccountBalance', () => {
  it('soma receitas e subtrai despesas da conta selecionada', () => {
    expect(calculateAccountBalance('Conta corrente', transactions)).toBe(4500)
    expect(calculateAccountBalance('Conta inexistente', transactions)).toBe(0)
  })
})
