import { createHash } from 'crypto'
import { getReferer } from '~~/server/utils/getReferer'
import { getSignedUrl } from '~~/server/services/firebase/storage'

export default defineEventHandler(async (event) => {
  const { file } = getRouterParams(event)

  const hasReferer = Boolean(getReferer(event))

  if (!hasReferer) {
    return getError(event, { status: 403, message: 'Forbidden' })
  }

  const isLogged = Boolean(await getLogged(event))

  if (!isLogged) {
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

  // Setar ETag
  setHeader(event, 'ETag', etag)

  const response = await fetch(url)
  const buffer = await response.arrayBuffer()

  return new Uint8Array(buffer)
})
