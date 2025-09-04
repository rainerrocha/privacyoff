import { replace, toLower } from 'lodash-es'

export const formatEmail = (email = '') => {
  try {
    return toLower(replace(email, /[^a-zA-Z0-9._@-]/g, ''))
      .replace(/^-|^[.]|^_/g, '')
      .replace(/[.]{2}/g, '.')
  } catch (error) {
    console.error(error)

    return email
  }
}
