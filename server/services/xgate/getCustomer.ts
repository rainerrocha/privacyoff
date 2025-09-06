import { getIp } from './getIp'
import { getToken } from './getToken'

export const getCustomer = async (id: string) => {
  try {
    const token = await getToken()

    const response = await fetch(`https://api.xgateglobal.com/customer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Forwarded-For': getIp()
      }
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    return null
  }
}
