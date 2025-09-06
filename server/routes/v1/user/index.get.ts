import { type H3Event } from 'h3'
import { IUser } from '~~/server/db/User'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const user = await getLogged(event)

    if (!user) {
      throw new Error('401_INVALID_SESSION')
    }

    const subs = (user.data.subscription ?? {}) as IUser['subscription']
    const active = subs && subs.status === 'active' && subs.expiresAt && subs.expiresAt > new Date()

    return getSuccess({
      ...user.data,
      subscription: {
        ...subs,
        status: active ? 'active' : 'pending'
      }
    })
  } catch (error) {
    return getError(event, error)
  }
})
