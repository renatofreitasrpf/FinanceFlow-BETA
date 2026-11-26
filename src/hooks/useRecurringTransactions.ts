import { useEffect, useState } from 'react'
import { initialRecurringTransactions } from '../data/recurringTransactions'
import {
  loadFromStorage,
  saveToStorage,
} from '../services/storage/localStorage'
import type { RecurringTransaction } from '../types/recurringTransaction'

const STORAGE_KEY = 'financeflow.recurringTransactions'

export function useRecurringTransactions() {
  const [recurringTransactions, setRecurringTransactions] = useState<
    RecurringTransaction[]
  >(() => loadFromStorage(STORAGE_KEY, initialRecurringTransactions))

  useEffect(() => {
    saveToStorage(STORAGE_KEY, recurringTransactions)
  }, [recurringTransactions])

  function addRecurringTransaction(
    transaction: Omit<RecurringTransaction, 'id'>,
  ) {
    setRecurringTransactions((current) => [
      ...current,
      { ...transaction, id: crypto.randomUUID() },
    ])
  }

  return { recurringTransactions, addRecurringTransaction }
}
