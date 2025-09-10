import { getIp } from './getIp'
import { getToken } from './getToken'

export const getDeposit = async (id: string) => {
  try {
    if (!id) {
      return {}
    }

    const token = await getToken()

    const response = await fetch(`https://api.xgateglobal.com/deposit/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Forwarded-For': getIp()
      }
    })

    if (!response.ok) {
      return {}
    }

    return await response.json()
  } catch (error) {
    console.error(error)

    return {}
  }
}
