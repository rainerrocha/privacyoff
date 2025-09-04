import type { H3Event } from 'h3'

export const getReferer = (event: H3Event) => getHeader(event, 'referer')
