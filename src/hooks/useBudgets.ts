import { useEffect, useState } from 'react'
import { initialBudgets } from '../data/budgets'
import {
  loadFromStorage,
  saveToStorage,
} from '../services/storage/localStorage'
import type { Budget } from '../types/budget'

const STORAGE_KEY = 'financeflow.budgets'

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>(() =>
    loadFromStorage(STORAGE_KEY, initialBudgets),
  )

  useEffect(() => {
    saveToStorage(STORAGE_KEY, budgets)
  }, [budgets])

  function addBudget(budget: Omit<Budget, 'id'>) {
    setBudgets((current) => [
      ...current,
      { ...budget, id: crypto.randomUUID() },
    ])
  }

  function updateBudget(id: string, budget: Omit<Budget, 'id'>) {
    setBudgets((current) =>
      current.map((item) => (item.id === id ? { ...budget, id } : item)),
    )
  }

  function deleteBudget(id: string) {
    setBudgets((current) => current.filter((budget) => budget.id !== id))
  }

  return { budgets, addBudget, updateBudget, deleteBudget }
}
