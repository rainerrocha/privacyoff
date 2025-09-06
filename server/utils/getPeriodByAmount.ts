export const getPeriodByAmount = (amount: number) => {
  if (amount === 29.9) return 'monthly'
  if (amount === 59.9) return 'quarterly'
  if (amount === 119.9) return 'annual'

  return 'monthly'
}
