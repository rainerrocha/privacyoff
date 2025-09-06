import { User } from '~~/server/db/User'
import { getDeposit } from '~~/server/services/xgate/getDeposit'
import { getCustomer } from '~~/server/services/xgate/getCustomer'
import { getExpiresAt } from '~~/server/utils/getExpiresAt'
import { getPeriodByAmount } from '~~/server/utils/getPeriodByAmount'

export default defineEventHandler(async (event) => {
  try {
    const { id } = await getRequestData(event)
    const { currency, customer, updatedDate } = await getDeposit(id)
    const { email } = await getCustomer(customer.externalId)
    const { status, amount } = currency || {}

    if (email && status === 'PAID') {
      const user = await User.getByEmail(email)
      const period = getPeriodByAmount(amount)
      const expiresAt = getExpiresAt(new Date(updatedDate), period)

      if (user) {
        await user.update({
          'subscription.id': id,
          'subscription.status': 'active',
          'subscription.period': period,
          'subscription.qrCode': null,
          'subscription.expiresAt': expiresAt
        })
      }
    }

    return getSuccess()
  } catch (error) {
    return getError(event, error)
  }
})
