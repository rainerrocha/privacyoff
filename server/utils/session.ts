import { setCookie, deleteCookie, type H3Event } from 'h3'
import { atob, btoa } from '~~/server/utils/base64'
import { decryptJson, encryptJson } from '~~/server/utils/crypto'
import { isDev } from '~~/shared/utils/isDev'
import { clear } from '~~/server/utils/clear'

export const generateSession = (aid: string, pwd: string) => {
  return btoa(encryptJson([aid, pwd, Date.now() + 1000 * 60 * 60 * 24]))
}

export const validateSession = (event: H3Event): [string, string] | null => {
  try {
    const session = getCookie(event, '__session') ?? ''

    if (session) {
      const [aid, pwd, exp] = decryptJson(atob(session))

      if (exp && exp > Date.now()) {
        return [aid, pwd]
      }
    }

    return null
  } catch {
    return null
  }
}

export const setSession = (event: H3Event, value?: string) => {
  const isProduction = !isDev()

  const cookieOptions = clear({
    path: '/',
    domain: isProduction ? '.privacyoff.com' : undefined,
    secure: isProduction,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    sameSite: 'strict'
  })

  if (value) {
    setCookie(event, '__session', value, cookieOptions)
  } else {
    deleteCookie(event, '__session')
  }

  return value
}
