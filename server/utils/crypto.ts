import { createHash, createDecipheriv, randomBytes, createCipheriv } from 'crypto'
import { getEnv } from '~~/server/utils/getEnv'

export const decrypt = (encrypted: string): string => {
  try {
    encrypted = Buffer.from(encrypted, 'base64').toString('hex')

    const algorithm = 'aes-256-ctr'
    const secretKey = getEnv('AES_SECRET')

    const ivHex = encrypted.slice(0, 32)
    const encryptedHex = encrypted.slice(32)

    const iv = Buffer.from(ivHex, 'hex')
    const encryptedText = Buffer.from(encryptedHex, 'hex')

    const key = createHash('sha256').update(secretKey).digest()

    const decipher = createDecipheriv(algorithm, key, iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString('utf8')
  } catch {
    return ''
  }
}

export const encrypt = (decrypted: string): string => {
  try {
    const algorithm = 'aes-256-ctr'
    const secretKey = getEnv('AES_SECRET')

    const iv = randomBytes(16)
    const key = createHash('sha256').update(secretKey).digest()

    const cipher = createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(decrypted, 'utf8')
    encrypted = Buffer.concat([encrypted, cipher.final()])

    return Buffer.from(iv.toString('hex') + encrypted.toString('hex'), 'hex').toString('base64')
  } catch {
    return ''
  }
}

export const decryptJson = (encrypted: string) => JSON.parse(decrypt(encrypted))
export const encryptJson = (decrypted: object) => encrypt(JSON.stringify(decrypted))
