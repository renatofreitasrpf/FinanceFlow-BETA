import { useEffect, useState } from 'react'
import { initialSavingsGoals } from '../data/savingsGoals'
import {
  loadFromStorage,
  saveToStorage,
} from '../services/storage/localStorage'
import type { SavingsGoal } from '../types/savingsGoal'

const STORAGE_KEY = 'financeflow.savingsGoals'

export function useSavingsGoals() {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() =>
    loadFromStorage(STORAGE_KEY, initialSavingsGoals),
  )

  useEffect(() => {
    saveToStorage(STORAGE_KEY, savingsGoals)
  }, [savingsGoals])

  function addSavingsGoal(goal: Omit<SavingsGoal, 'id'>) {
    setSavingsGoals((current) => [
      ...current,
      { ...goal, id: crypto.randomUUID() },
    ])
  }

  function updateSavingsGoal(id: string, goal: Omit<SavingsGoal, 'id'>) {
    setSavingsGoals((current) =>
      current.map((item) => (item.id === id ? { ...goal, id } : item)),
    )
  }

  function deleteSavingsGoal(id: string) {
    setSavingsGoals((current) => current.filter((goal) => goal.id !== id))
  }

  return {
    savingsGoals,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
  }
}
