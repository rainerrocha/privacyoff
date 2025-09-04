import { toLower } from 'lodash-es'
import * as validator from 'validator/lib/isEmail'

export const isEmail = (email: string) => {
  try {
    return validator.default(toLower(email))
  } catch (error) {
    console.error(error)

    return false
  }
}
