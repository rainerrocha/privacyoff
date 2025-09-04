import { H3Event } from 'h3'
import { User } from '~~/server/db/User'

export const getLogged = async (event: H3Event) => {
  try {
    const [id, password] = validateSession(event) ?? []

    if (!id || !password) {
      return null
    }

    const user = await User.get(id)

    if (user && user.data && user.data?.password !== password) {
      return null
    }

    return user
  } catch {
    return null
  }
}
