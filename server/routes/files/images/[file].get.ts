import { createHash } from 'crypto'
import { getReferer } from '~~/server/utils/getReferer'
import { getSignedUrl } from '~~/server/services/firebase/storage'

export default defineEventHandler(async (event) => {
  const { file } = getRouterParams(event)

  const hasReferer = Boolean(getReferer(event))

  if (!hasReferer) {
    return getError(event, { status: 403, message: 'Forbidden' })
  }

  const user = await getLogged(event)

  if (!user) {
    return getError(event, { status: 401, message: 'Unauthorized' })
  }

  if (!user.hasActiveSubscription()) {
    return getError(event, { status: 401, message: 'Unauthorized' })
  }

  const url = await getSignedUrl(`images/${file}`)

  if (!url) {
    return getError(event, { status: 404, message: 'File not found' })
  }

  // Gerar ETag simples baseado no nome + timestamp (pode melhorar com hash real)
  const etag = createHash('md5').update(file).digest('hex')

  // Verificar se o navegador já tem o recurso
  if (getHeader(event, 'if-none-match') === etag) {
    return setResponseStatus(event, 304)
  }

  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const contentType = response.headers.get('content-type') || 'image/jpeg'

  // Setar ETag e contentType
  setHeader(event, 'ETag', etag)
  setHeader(event, 'Content-Type', contentType as string)

  return new Uint8Array(buffer)
})
