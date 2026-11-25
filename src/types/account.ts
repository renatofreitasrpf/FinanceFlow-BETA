export type AccountType = 'checking' | 'savings' | 'credit' | 'cash'

export interface Account {
  id: string
  name: string
  type: AccountType
  color: string
}
