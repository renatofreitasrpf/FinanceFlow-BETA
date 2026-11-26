import type { RecurringTransaction } from '../types/recurringTransaction'
import type { Transaction } from '../types/transaction'

type DateParts = {
  year: number
  month: number
  day: number
}

type RecurringTransactionGeneration = {
  generatedTransactions: Transaction[]
  recurringTransactions: RecurringTransaction[]
}

function parseDate(date: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const parsedDate = new Date(Date.UTC(year, month - 1, day))

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return null
  }

  return { year, month: month - 1, day }
}

function formatDate({ year, month, day }: DateParts): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getOccurrenceDate(
  startDate: string,
  frequency: RecurringTransaction['frequency'],
  occurrenceNumber: number,
): string | null {
  const start = parseDate(startDate)
  if (!start || occurrenceNumber < 1) return null

  if (frequency === 'weekly') {
    const date = new Date(
      Date.UTC(start.year, start.month, start.day + occurrenceNumber * 7),
    )
    return formatDate({
      year: date.getUTCFullYear(),
      month: date.getUTCMonth(),
      day: date.getUTCDate(),
    })
  }

  if (frequency !== 'monthly' && frequency !== 'yearly') return null

  const monthsToAdvance =
    frequency === 'monthly' ? occurrenceNumber : occurrenceNumber * 12
  const totalMonth = start.year * 12 + start.month + monthsToAdvance
  const year = Math.floor(totalMonth / 12)
  const month = totalMonth % 12
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  return formatDate({
    year,
    month,
    day: Math.min(start.day, lastDay),
  })
}

export function generateDueRecurringTransactions(
  recurringTransactions: RecurringTransaction[],
  transactions: Transaction[],
  today: string,
): RecurringTransactionGeneration {
  if (!parseDate(today)) {
    return { generatedTransactions: [], recurringTransactions }
  }

  const existingOccurrences = new Set(
    transactions.flatMap((transaction) =>
      transaction.recurringTransactionId
        ? [`${transaction.recurringTransactionId}:${transaction.date}`]
        : [],
    ),
  )
  const generatedTransactions: Transaction[] = []
  const updatedRecurringTransactions = recurringTransactions.map(
    (recurringTransaction) => {
      const startDate = recurringTransaction.startDate
      const start = parseDate(startDate)
      const storedLastDate = recurringTransaction.lastGeneratedDate
      const validLastDate = storedLastDate && parseDate(storedLastDate)
      if (!start) return recurringTransaction

      let lastGeneratedDate =
        validLastDate && storedLastDate > startDate ? storedLastDate : startDate
      let occurrenceNumber = 1
      let occurrenceDate = getOccurrenceDate(
        recurringTransaction.startDate,
        recurringTransaction.frequency,
        occurrenceNumber,
      )

      while (occurrenceDate && occurrenceDate <= lastGeneratedDate) {
        occurrenceNumber += 1
        occurrenceDate = getOccurrenceDate(
          recurringTransaction.startDate,
          recurringTransaction.frequency,
          occurrenceNumber,
        )
      }

      while (occurrenceDate && occurrenceDate <= today) {
        const occurrenceKey = `${recurringTransaction.id}:${occurrenceDate}`
        if (!existingOccurrences.has(occurrenceKey)) {
          generatedTransactions.push({
            id: occurrenceKey,
            recurringTransactionId: recurringTransaction.id,
            name: recurringTransaction.name,
            category: recurringTransaction.category,
            date: occurrenceDate,
            account: recurringTransaction.account,
            amount: recurringTransaction.amount,
            type: recurringTransaction.type,
          })
          existingOccurrences.add(occurrenceKey)
        }

        lastGeneratedDate = occurrenceDate
        occurrenceNumber += 1
        occurrenceDate = getOccurrenceDate(
          recurringTransaction.startDate,
          recurringTransaction.frequency,
          occurrenceNumber,
        )
      }

      return lastGeneratedDate === startDate &&
        recurringTransaction.lastGeneratedDate === undefined
        ? recurringTransaction
        : { ...recurringTransaction, lastGeneratedDate }
    },
  )

  generatedTransactions.sort((first, second) =>
    second.date.localeCompare(first.date),
  )

  return {
    generatedTransactions,
    recurringTransactions: updatedRecurringTransactions,
  }
}
