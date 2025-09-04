import dotenv from '@dotenvx/dotenvx'

export const getEnv = (key: string) => {
  dotenv.config({ quiet: true })

  return process.env[key] || ''
}
