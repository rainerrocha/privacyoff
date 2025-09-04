import { getHeader } from 'h3'

export const useApi = async (
  path: string,
  options: Record<string, any> = {}
): Promise<Record<string, any>> => {
  try {
    const headers = {
      ...(options.headers || {})
    }

    if (import.meta.server) {
      const event = useRequestEvent()

      if (event) {
        const cookies = getHeader(event, 'cookie')

        if (cookies) {
          headers.cookie = cookies
        }
      }
    }

    const response = await $fetch(path, {
      ...options,
      headers,
      credentials: 'include',
      ignoreResponseError: true
    })

    const { error, success, ...data } = response as Record<string, any>

    if (success) {
      return { ...data, success: true }
    }

    return { error: error?.message || 'INTERNAL_ERROR' }
  } catch (error) {
    console.error(error)

    return { error: 'INTERNAL_ERROR' }
  }
}
