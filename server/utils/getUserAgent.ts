import type { H3Event } from 'h3'

export const getUserAgent = (event: H3Event) => {
  try {
    return getHeader(event, 'user-agent') || ''
  } catch {
    return ''
  }
}
