import { getRecentMonths } from '../../../utils/dates'

type MonthSelectorProps = {
  period: string
  onChange: (period: string) => void
}

export function MonthSelector({ period, onChange }: MonthSelectorProps) {
  const monthOptions = getRecentMonths(12)

  return (
    <select
      className="period-button month-selector"
      value={period}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Selecionar mes"
    >
      <option value="">Todo o tempo</option>
      {monthOptions.map((month) => (
        <option value={month.value} key={month.value}>
          {month.label}
        </option>
      ))}
    </select>
  )
}