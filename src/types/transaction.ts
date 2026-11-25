export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  name: string
  category: string
  date: string
  account: string
  amount: number
  type: TransactionType
}