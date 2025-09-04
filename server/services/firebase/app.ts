import { getEnv } from '~~/server/utils/getEnv'
import { initializeApp, cert } from 'firebase-admin/app'

const serviceAccount = JSON.parse(Buffer.from(getEnv('FSA_BASE64'), 'base64').toString('utf-8'))

export const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gs://cdn.privacyoff.com'
})
