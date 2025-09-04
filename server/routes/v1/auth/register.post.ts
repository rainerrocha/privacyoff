import { User } from '~~/server/db/User'
import { isEmail } from '~~/shared/utils/isEmail'
import { formatEmail } from '~~/shared/utils/formatEmail'

const getData = (requestData: Record<string, any>) => {
  let { email, password } = requestData

  email = formatEmail(email)

  if (!email) throw new Error('REQUIRED_EMAIL')
  if (!password) throw new Error('REQUIRED_PASSWORD')

  if (!isEmail(email)) throw new Error('INVALID_EMAIL')
  if (password.length < 6) throw new Error('INVALID_PASSWORD')

  return { email, password }
}

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = getData(await getRequestData(event))

    const exists = await User.getByEmail(email)

    if (exists) {
      throw new HttpError(401, 'USER_ALREADY_REGISTERED')
    }

    const user = await User.create({ email, password })

    if (!user) {
      throw new HttpError(401, 'FAILED_TO_REGISTER')
    }

    const session = generateSession(user.id, password)

    if (session) {
      setSession(event, session)
    }

    return getSuccess()
  } catch (error) {
    return getError(event, error)
  }
})
