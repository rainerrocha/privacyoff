import type { H3Event } from 'h3'

export const isServerRequest = (event: H3Event) => {
  try {
    return Boolean(JSON.stringify(event.node.res))
  } catch {
    return false
  }
}
