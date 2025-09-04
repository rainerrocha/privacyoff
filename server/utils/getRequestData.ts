import { type H3Event } from 'h3'

export const getRequestData = async (event: H3Event): Promise<Record<string, any>> => {
  try {
    return (await readBody(event)) || {}
  } catch {
    return {}
  }
}
