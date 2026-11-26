import { initialRecurringTransactions } from '../data/recurringTransactions'
import { initialTransactions } from '../data/transactions'
import { loadFromStorage, saveToStorage } from './storage/localStorage'
import { generateDueRecurringTransactions } from '../utils/recurringTransactions'

const TRANSACTIONS_STORAGE_KEY = 'financeflow.transactions'
const RECURRING_TRANSACTIONS_STORAGE_KEY = 'financeflow.recurringTransactions'

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function generateDueTransactionsOnStartup(): void {
  const transactions = loadFromStorage(
    TRANSACTIONS_STORAGE_KEY,
    initialTransactions,
  )
  const recurringTransactions = loadFromStorage(
    RECURRING_TRANSACTIONS_STORAGE_KEY,
    initialRecurringTransactions,
  )
  const result = generateDueRecurringTransactions(
    recurringTransactions,
    transactions,
    getDateKey(new Date()),
  )

  if (result.generatedTransactions.length > 0) {
    saveToStorage(TRANSACTIONS_STORAGE_KEY, [
      ...result.generatedTransactions,
      ...transactions,
    ])
  }

  if (
    result.recurringTransactions.some(
      (recurringTransaction, index) =>
        recurringTransaction.lastGeneratedDate !==
        recurringTransactions[index]?.lastGeneratedDate,
    )
  ) {
    saveToStorage(
      RECURRING_TRANSACTIONS_STORAGE_KEY,
      result.recurringTransactions,
    )
  }
}
