import { app } from './app'
import { getStorage } from 'firebase-admin/storage'

export const bucket = getStorage(app).bucket()

export const getSignedUrl = async (path: string, minutes = 60) => {
  try {
    const [url] = await bucket.file(path).getSignedUrl({
      action: 'read',
      expires: new Date(Date.now() + minutes * 60 * 1000)
    })

    return url
  } catch (error) {
    console.log(error)

    return null
  }
}

export async function uploadBuffer(
  path: string,
  buffer: Buffer,
  contentType = 'application/octet-stream'
) {
  try {
    await bucket.file(path).save(buffer, {
      metadata: {
        contentType,
        cacheControl: `public, max-age=${365 * 24 * 60 * 60}, immutable`
      }
    })

    return true
  } catch (error) {
    console.log(error)

    return false
  }
}
