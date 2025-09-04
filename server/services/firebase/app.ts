import { getEnv } from '~~/server/utils/getEnv'
import { initializeApp, cert, applicationDefault } from 'firebase-admin/app'

const getApp = () => {
  const serviceAccount = isDev()
    ? JSON.parse(Buffer.from(getEnv('FSA_BASE64'), 'base64').toString('utf-8'))
    : null

  return initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
    storageBucket: 'gs://privacy-off.firebasestorage.app'
  })
}

export const app = getApp()
