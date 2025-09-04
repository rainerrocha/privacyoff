import { type H3Event } from 'h3'
import { getIp } from '~~/server/utils/getIp'
import { getUserAgent } from '~~/server/utils/getUserAgent'

export const getRequestContext = async (event: H3Event) => {
  try {
    return {
      ipAddress: getIp(event),
      userAgent: getUserAgent(event)
    }
  } catch {
    return {}
  }
}
