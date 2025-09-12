const { getEnv } = require('./getEnv')
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app')

const getApp = () => {
  const serviceAccount = JSON.parse(Buffer.from(getEnv('FSA_BASE64'), 'base64').toString('utf-8'))

  return initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
    storageBucket: 'gs://privacy-off.firebasestorage.app'
  })
}

exports.app = getApp()
