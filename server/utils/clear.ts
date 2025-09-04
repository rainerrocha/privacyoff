import { isNil, omitBy } from 'lodash-es'

export const clear = (json: Record<string, any>) => {
  try {
    return omitBy(json, isNil)
  } catch {
    return json
  }
}
