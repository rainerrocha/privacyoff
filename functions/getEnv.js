const dotenv = require('@dotenvx/dotenvx')

module.exports.getEnv = (key) => {
  dotenv.config({ quiet: true })

  return process.env[key] || ''
}
