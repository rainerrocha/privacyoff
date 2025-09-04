import dotenv from '@dotenvx/dotenvx'

export const getEnv = (key: string) => {
  if (isDev()) dotenv.config({ quiet: true })

  return process.env[key] || ''
}
