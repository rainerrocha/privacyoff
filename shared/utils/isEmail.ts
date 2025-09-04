import { toLower } from 'lodash-es'
import validator from 'validator'

export const isEmail = (email: string) => {
  try {
    return validator.isEmail(toLower(email))
  } catch (error) {
    console.error(error)

    return false
  }
}
