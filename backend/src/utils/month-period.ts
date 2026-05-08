export type MonthPeriod = {
  year: number
  month: number
}

export function getMonthDistance(startMonth: MonthPeriod, targetMonth: MonthPeriod) {
  return ((targetMonth.year - startMonth.year) * 12) + (targetMonth.month - startMonth.month)
}

export function isMonthWithinRecurringRange(startMonth: MonthPeriod, targetMonth: MonthPeriod, occurrences?: number | null) {
  const distance = getMonthDistance(startMonth, targetMonth)

  if (distance < 0) {
    return false
  }

  if (occurrences != null && distance >= occurrences) {
    return false
  }

  return true
}