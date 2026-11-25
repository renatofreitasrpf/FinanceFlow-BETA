export type MonthOption = {
  value: string
  label: string
  shortLabel: string
}

export function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function getRecentMonths(count: number, from = new Date()): MonthOption[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(from.getFullYear(), from.getMonth() - count + index + 1, 1)
    return {
      value: getMonthKey(date),
      label: new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date),
      shortLabel: new Intl.DateTimeFormat('pt-BR', { month: 'short' })
        .format(date)
        .replace('.', ''),
    }
  })
}