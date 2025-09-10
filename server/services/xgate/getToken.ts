import { getIp } from './getIp'

let token: string | null = null

export const getToken = async () => {
  try {
    if (token) {
      return token
    }

    const response = await fetch('https://api.xgateglobal.com/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': getIp()
      },
      body: JSON.stringify({
        email: getEnv('XGATE_USER'),
        password: getEnv('XGATE_PASS')
      })
    })

    if (!response.ok) {
      return null
    }

    token = (await response.json()).token

    return token
  } catch (error) {
    console.error(error)

    return null
  }
}
