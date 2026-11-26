import type { Transaction } from './transaction'

export type RecurrenceFrequency = 'weekly' | 'monthly' | 'yearly'

export interface RecurringTransaction extends Omit<Transaction, 'id' | 'date'> {
  id: string
  startDate: string
  frequency: RecurrenceFrequency
}
