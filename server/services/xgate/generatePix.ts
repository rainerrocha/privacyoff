import { getIp } from './getIp'
import { getName } from './getName'
import { getToken } from './getToken'
import { getCurrency } from './getCurrency'

const deposit = async (email: string, amount: number) => {
  try {
    if (!email || !amount) {
      return {}
    }

    const token = await getToken()
    const currency = await getCurrency()

    const response = await fetch('https://api.xgateglobal.com/deposit', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Forwarded-For': getIp()
      },
      body: JSON.stringify({
        amount,
        customer: {
          name: getName(),
          email
        },
        currency
      })
    })

    if (!response.ok) {
      return {}
    }

    return (await response.json())?.data
  } catch (error) {
    console.error(error)

    return {}
  }
}

export const generatePix = async (email: string, amount: number) => {
  try {
    return await deposit(email, amount)
  } catch (error) {
    console.error(error)

    return {}
  }
}
