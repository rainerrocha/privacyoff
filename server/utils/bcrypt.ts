import bcrypt from 'bcrypt'

export async function generateHash(data: string | Buffer, saltOrRounds?: number | string) {
  try {
    return await bcrypt.hash(data, saltOrRounds || 10)
  } catch {
    return ''
  }
}

export async function verifyHash(data: string | Buffer, encrypted: string) {
  try {
    return await bcrypt.compare(data, encrypted)
  } catch (error) {
    console.error(error)

    return false
  }
}
