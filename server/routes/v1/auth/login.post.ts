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

    const account = await User.getByEmail(email)

    if (!account) {
      throw new HttpError(401, 'INVALID_ACCOUNT')
    }

    if (!(await account.verifyPassword(password))) {
      throw new HttpError(401, 'INVALID_CREDENTIALS')
    }

    const session = generateSession(account.id, password)

    if (session) {
      setSession(event, session)
    }

    return getSuccess()
  } catch (error) {
    return getError(event, error)
  }
})
