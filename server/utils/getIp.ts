import type { H3Event } from 'h3'

export const getIp = (event: H3Event) => {
  try {
    return getHeader(event, 'x-forwarded-for')?.split(',')[0].trim() || ''
  } catch {
    return ''
  }
}
