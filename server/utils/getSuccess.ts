import { clear } from '~~/server/utils/clear'

export const getSuccess = (data?: any, success = true) => {
  return clear({ data, success })
}
