import { describe, expect, it } from 'vitest'
import type { RecurringTransaction } from '../types/recurringTransaction'
import { generateDueRecurringTransactions } from './recurringTransactions'

const recurringTransaction: RecurringTransaction = {
  id: 'recurring-1',
  name: 'Salario',
  category: 'Renda',
  account: 'Conta corrente',
  amount: 5000,
  type: 'income',
  startDate: '2026-11-01',
  frequency: 'weekly',
}

describe('generateDueRecurringTransactions', () => {
  it('gera ocorrencias semanais vencidas depois da data inicial', () => {
    const result = generateDueRecurringTransactions(
      [recurringTransaction],
      [],
      '2026-11-16',
    )

    expect(
      result.generatedTransactions.map((transaction) => transaction.date),
    ).toEqual(['2026-11-15', '2026-11-08'])
    expect(result.generatedTransactions[0]).toMatchObject({
      recurringTransactionId: recurringTransaction.id,
      name: recurringTransaction.name,
      amount: recurringTransaction.amount,
      type: recurringTransaction.type,
    })
    expect(result.recurringTransactions[0].lastGeneratedDate).toBe('2026-11-15')
  })

  it('mantem o dia inicial ao gerar ocorrencias mensais no fim do mes', () => {
    const result = generateDueRecurringTransactions(
      [
        {
          ...recurringTransaction,
          startDate: '2026-01-31',
          frequency: 'monthly',
        },
      ],
      [],
      '2026-03-31',
    )

    expect(
      result.generatedTransactions.map((transaction) => transaction.date),
    ).toEqual(['2026-03-31', '2026-02-28'])
  })

  it('ajusta datas anuais de ano bissexto para o ultimo dia valido', () => {
    const result = generateDueRecurringTransactions(
      [
        {
          ...recurringTransaction,
          startDate: '2024-02-29',
          frequency: 'yearly',
        },
      ],
      [],
      '2026-03-01',
    )

    expect(
      result.generatedTransactions.map((transaction) => transaction.date),
    ).toEqual(['2026-02-28', '2025-02-28'])
  })
})
