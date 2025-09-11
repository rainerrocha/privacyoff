import { User } from '~~/server/db/User'
import { getDeposit } from '~~/server/services/xgate/getDeposit'
import { getCustomer } from '~~/server/services/xgate/getCustomer'
import { getExpiresAt } from '~~/server/utils/getExpiresAt'
import { getPeriodByAmount } from '~~/server/utils/getPeriodByAmount'

const sendNotify = async (amount: number) => {
  try {
    const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

    await fetch('https://ntfy.sh/privacyoff_sales', {
      method: 'POST',
      headers: {
        Title: 'Venda realizada!',
        Click: 'https://privacyoff.com/',
        Attach: 'https://privacyoff.com/favicon-96x96.png'
      },
      body: `Valor recebido: ${formatter.format(amount)}`
    })
  } catch (error) {
    console.error(error)
  }
}

export default defineEventHandler(async (event) => {
  try {
    const { id } = await getRequestData(event)
    const { currency, customer, updatedDate } = await getDeposit(id)
    const { email } = await getCustomer(customer?.externalId)
    const { status, amount } = currency || {}

    if (email && status === 'PAID') {
      const user = await User.getByEmail(email)
      const period = getPeriodByAmount(amount)
      const expiresAt = getExpiresAt(new Date(updatedDate), period)

      if (user) {
        await user.update({
          subscription: {
            id,
            status: 'active',
            period,
            expiresAt
          }
        })

        await sendNotify(amount)
      }
    }

    return getSuccess()
  } catch (error) {
    return getError(event, error)
  }
})
