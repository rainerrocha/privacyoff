import { createHash } from 'crypto'
import { getSignedUrl } from '~~/server/services/firebase/storage'
import sharp from 'sharp'

export default defineEventHandler(async (event) => {
  const { file } = getRouterParams(event)

  const url = await getSignedUrl(`images/${file}`)

  if (!url) {
    return getError(event, { status: 404, message: 'File not found' })
  }

  // Gerar ETag simples baseado no nome + timestamp (pode melhorar com hash real)
  const etag = createHash('md5').update(`${file}-blur`).digest('hex')

  // Verificar se o navegador já tem o recurso
  if (getHeader(event, 'if-none-match') === etag) {
    return setResponseStatus(event, 304)
  }

  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = await sharp(arrayBuffer).blur(25).jpeg().toBuffer()

  // Setar ETag e contentType
  setHeader(event, 'ETag', etag)
  setHeader(event, 'Content-Type', 'image/jpeg')

  return new Uint8Array(buffer)
})
