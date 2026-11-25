import type { Transaction } from '../types/transaction'
import type { FinanceTotals } from '../types/dashboard'

export interface CategoryTotal {
  name: string
  count: number
  amount: number
}

export function calculateTotals(transactions: Transaction[]): FinanceTotals {
  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const expenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)

  return {
    income,
    expenses,
    balance: income - expenses,
  }
}

export function calculateCategoryTotals(transactions: Transaction[]): CategoryTotal[] {
  const totals = new Map<string, { count: number; amount: number }>()

  transactions.forEach((transaction) => {
    const current = totals.get(transaction.category) ?? { count: 0, amount: 0 }
    totals.set(transaction.category, {
      count: current.count + 1,
      amount: current.amount + transaction.amount,
    })
  })

  return Array.from(totals.entries())
    .map(([name, values]) => ({ name, ...values }))
    .sort((first, second) => second.amount - first.amount)
}

export function filterTransactionsByMonth(transactions: Transaction[], month: string) {
  if (!month) return transactions
  return transactions.filter((transaction) => transaction.date.startsWith(month))
}

export function calculateAccountBalance(accountName: string, transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.account === accountName)
    .reduce(
      (balance, transaction) =>
        balance + (transaction.type === 'income' ? transaction.amount : -transaction.amount),
      0,
    )
}