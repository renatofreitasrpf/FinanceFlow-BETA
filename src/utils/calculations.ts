import type { Transaction } from '../types/transaction'
import type { FinanceTotals } from '../types/dashboard'
import type { Budget } from '../types/budget'
import type { SavingsGoal } from '../types/savingsGoal'

export interface CategoryTotal {
  name: string
  count: number
  amount: number
}

export interface BudgetProgress {
  spent: number
  limit: number
  remaining: number
  percentageUsed: number
  isExceeded: boolean
}

export function calculateBudgetProgress(
  budget: Budget,
  transactions: Transaction[],
): BudgetProgress {
  const spent = transactions
    .filter(
      (transaction) =>
        transaction.type === 'expense' &&
        transaction.category === budget.category &&
        transaction.date.startsWith(budget.month),
    )
    .reduce((total, transaction) => total + transaction.amount, 0)

  return {
    spent,
    limit: budget.limit,
    remaining: budget.limit - spent,
    percentageUsed: budget.limit > 0 ? (spent / budget.limit) * 100 : 0,
    isExceeded: spent > budget.limit,
  }
}

export interface SavingsGoalProgress {
  remaining: number
  percentageComplete: number
  progressPercentage: number
  isComplete: boolean
}

export function calculateSavingsGoalProgress(
  goal: SavingsGoal,
): SavingsGoalProgress {
  const percentageComplete =
    goal.targetAmount > 0
      ? (goal.currentAmount / goal.targetAmount) * 100
      : 0

  return {
    remaining: Math.max(goal.targetAmount - goal.currentAmount, 0),
    percentageComplete,
    progressPercentage: Math.min(Math.max(percentageComplete, 0), 100),
    isComplete:
      goal.targetAmount > 0 && goal.currentAmount >= goal.targetAmount,
  }
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