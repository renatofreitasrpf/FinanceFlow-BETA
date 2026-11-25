import { useEffect, useState } from 'react'
import { initialAccounts } from '../data/accounts'
import { loadFromStorage, saveToStorage } from '../services/storage/localStorage'
import type { Account } from '../types/account'

const STORAGE_KEY = 'financeflow.accounts'

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>(() =>
    loadFromStorage(STORAGE_KEY, initialAccounts),
  )

  useEffect(() => {
    saveToStorage(STORAGE_KEY, accounts)
  }, [accounts])

  function addAccount(account: Omit<Account, 'id'>) {
    setAccounts((current) => [
      ...current,
      { ...account, id: crypto.randomUUID() },
    ])
  }

  function updateAccount(id: string, account: Omit<Account, 'id'>) {
    setAccounts((current) =>
      current.map((item) => (item.id === id ? { ...account, id } : item)),
    )
  }

  function deleteAccount(id: string) {
    setAccounts((current) => current.filter((account) => account.id !== id))
  }

  return { accounts, addAccount, updateAccount, deleteAccount }
}
