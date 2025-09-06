const addDays = (date: Date, days: number) => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

export const getExpiresAt = (date: Date, period: string) => {
  if (period === 'monthly') return addDays(date, 30)
  if (period === 'quarterly') return addDays(date, 90)
  if (period === 'annual') return addDays(date, 365)

  return new Date()
}
