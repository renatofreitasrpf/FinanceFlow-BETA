import { useEffect, useState } from 'react'
import { initialCategories } from '../data/categories'
import { loadFromStorage, saveToStorage } from '../services/storage/localStorage'
import type { Category } from '../types/category'

const STORAGE_KEY = 'financeflow.categories'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() =>
    loadFromStorage(STORAGE_KEY, initialCategories),
  )

  useEffect(() => {
    saveToStorage(STORAGE_KEY, categories)
  }, [categories])

  function addCategory(category: Omit<Category, 'id'>) {
    setCategories((current) => [
      ...current,
      { ...category, id: crypto.randomUUID() },
    ])
  }

  function updateCategory(id: string, category: Omit<Category, 'id'>) {
    setCategories((current) =>
      current.map((item) => (item.id === id ? { ...category, id } : item)),
    )
  }

  function deleteCategory(id: string) {
    setCategories((current) => current.filter((item) => item.id !== id))
  }

  return { categories, addCategory, updateCategory, deleteCategory }
}