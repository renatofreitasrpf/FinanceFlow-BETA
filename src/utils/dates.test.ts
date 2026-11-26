import { describe, expect, it } from 'vitest'
import { getMonthKey, getRecentMonths } from './dates'

describe('getRecentMonths', () => {
  it('inclui o mes atual e nao retorna meses futuros', () => {
    const months = getRecentMonths(6, new Date(2026, 10, 25))

    expect(months.map((month) => month.value)).toEqual([
      '2026-06',
      '2026-07',
      '2026-08',
      '2026-09',
      '2026-10',
      '2026-11',
    ])
  })

  it('calcula corretamente o periodo ao atravessar um ano', () => {
    expect(getRecentMonths(3, new Date(2027, 0, 5)).map((month) => month.value)).toEqual([
      '2026-11',
      '2026-12',
      '2027-01',
    ])
    expect(getMonthKey(new Date(2027, 0, 5))).toBe('2027-01')
  })
})
