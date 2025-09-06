export default defineEventHandler(async (event) => {
  try {
    const user = await getLogged(event)
    const { status, expiresAt } = user?.data?.subscription ?? {}

    if (status === 'active') {
      if (expiresAt && expiresAt > new Date()) {
        return getSuccess({ status: 'active', expiresAt })
      } else {
        return getSuccess({ status: 'expired' })
      }
    }

    return getSuccess({ status: 'pending' })
  } catch (error) {
    return getError(event, error)
  }
})
