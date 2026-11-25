import { useEffect, useState } from 'react'
import { initialTransactions } from '../data/transactions'
import { loadFromStorage, saveToStorage } from '../services/storage/localStorage'
import type { Transaction } from '../types/transaction'

const STORAGE_KEY = 'financeflow.transactions'

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage(STORAGE_KEY, initialTransactions),
  )

  useEffect(() => {
    saveToStorage(STORAGE_KEY, transactions)
  }, [transactions])

  function addTransaction(transaction: Omit<Transaction, 'id'>) {
    setTransactions((current) => [
      { ...transaction, id: crypto.randomUUID() },
      ...current,
    ])
  }

  function updateTransaction(id: string, transaction: Omit<Transaction, 'id'>) {
    setTransactions((current) =>
      current.map((item) => (item.id === id ? { ...transaction, id } : item)),
    )
  }

  function deleteTransaction(id: string) {
    setTransactions((current) => current.filter((item) => item.id !== id))
  }

  return { transactions, addTransaction, updateTransaction, deleteTransaction }
}