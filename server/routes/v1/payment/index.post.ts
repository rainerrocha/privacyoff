import { generatePix } from '~~/server/services/xgate/generatePix'

export default defineEventHandler(async (event) => {
  try {
    const { period } = await getRequestData(event)

    if (!period) {
      return getError(event, '400_PERIOD_REQUIRED')
    }

    if (!['monthly', 'quarterly', 'semiannual', 'annual', 'lifetime'].includes(period)) {
      return getError(event, '400_INVALID_PERIOD')
    }

    const user = await getLogged(event)

    const { data } = user ?? {}
    const { email, subscription } = data ?? {}

    if (!user || !email) {
      return getError(event, '401_UNAUTHORIZED')
    }

    if (
      subscription?.status === 'active' &&
      subscription.expiresAt &&
      subscription.expiresAt > new Date()
    ) {
      return getError(event, '400_SUBSCRIPTION_ALREADY_EXISTS')
    }

    let amount = 0
    let description = ''
    let expiresAt = new Date()

    if (period === 'monthly') {
      amount = 29.9
      description = 'Acesso mensal'
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    } else if (period === 'quarterly') {
      amount = 59.9
      description = 'Acesso trimestral'
      expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    } else if (period === 'annual') {
      amount = 119.9
      description = 'Acesso anual'
      expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }

    if (!amount) {
      return getError(event, '400_INVALID_PERIOD')
    }

    const { id, code: qrCode } = await generatePix(email, amount)

    if (!id || !qrCode) {
      return getError(event, '400_FAILED_TO_GENERATE_PIX')
    }

    await user.update({
      subscription: {
        id,
        status: 'pending',
        qrCode,
        period,
        expiresAt
      }
    })

    return getSuccess({ qrCode })
  } catch (error) {
    return getError(event, error)
  }
})
