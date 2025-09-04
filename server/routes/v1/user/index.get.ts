import { type H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const user = await getLogged(event)

    if (!user) {
      throw new Error('401_INVALID_SESSION')
    }

    return getSuccess(user)
  } catch (error) {
    return getError(event, error)
  }
})
