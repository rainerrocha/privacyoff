export default defineEventHandler(async (event) => {
  try {
    const { plan } = await getRequestData(event)

    if (!plan) {
      return getError(event, '400_PLAN_REQUIRED')
    }

    if (!['monthly', 'quarterly', 'semiannual', 'annual', 'lifetime'].includes(plan)) {
      return getError(event, '400_INVALID_PLAN')
    }

    const user = await getLogged(event)

    if (!user) {
      return getError(event, '401_UNAUTHORIZED')
    }

    if (user.data.subscription?.expiresAt && user.data.subscription.expiresAt > new Date()) {
      return getError(event, '400_SUBSCRIPTION_ALREADY_EXISTS')
    }

    return getSuccess({
      qrCode: `00020101021226800014br.gov.bcb.pix2558pix.delbank.com.br/v2/cob/vcharge1452bcce8b2f4b6cbace29c2a5204000053039865802BR5925PUSHINPAYSISTEMAS DE COB6007ARACAJU62070503***6304CF76`
    })
  } catch (error) {
    return getError(event, error)
  }
})
