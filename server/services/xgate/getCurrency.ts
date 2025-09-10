import { getIp } from './getIp'
import { getToken } from './getToken'

export const getCurrency = async () => {
  try {
    const token = await getToken()

    const response = await fetch('https://api.xgateglobal.com/deposit/company/currencies', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Forwarded-For': getIp()
      }
    })

    if (!response.ok) {
      return {}
    }

    return (await response.json()).find((currency: Record<string, any>) => currency.type === 'PIX')
  } catch (error) {
    console.error(error)

    return {}
  }
}
