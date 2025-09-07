import axios from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { uploadBuffer } from '../../services/firebase/storage'
import { toLower } from 'lodash-es'
import { createHash } from 'crypto'
import { extension } from 'mime-types'
import { Media } from '../../db/Media'
import { Model } from '../../db/Model'

const jar = new CookieJar()

const site = wrapper(
  axios.create({
    baseURL: 'https://noprivado.com',
    jar,
    withCredentials: true,
    headers: {
      'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36`,
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
    }
  })
)

const login = async () => {
  try {
    await jar.setCookie('over18=true', 'https://noprivado.com')

    // 1. GET login page
    const loginPage = await site.get('/login')
    const html = loginPage.data

    const tokenMatch = html.match(/<input type="hidden" value="([a-f0-9]{32})" name="token">/)

    if (!tokenMatch) {
      throw new Error('Token não encontrado!')
    }

    const token = tokenMatch[1]

    // 2. POST login
    const form = new URLSearchParams({
      username: 'we0606',
      password: 'so3004',
      token
    })

    const loginResponse = await site.post('/login', form.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: 'https://noprivado.com/login',
        Origin: 'https://noprivado.com'
      }
    })

    if (!/pesquisar modelo/i.test(loginResponse.data)) {
      throw new Error('Login falhou!')
    }

    return true
  } catch (error) {
    console.error('Erro no login:', (error as Error).message)

    return false
  }
}

const getFileMd5 = (buffer: Buffer) => {
  return createHash('md5').update(buffer).digest('hex')
}

const downloadFile = async (url: string) => {
  try {
    const response = await fetch(`https://noprivado.com${url}`, {
      headers: {
        Cookie: jar.getCookieStringSync('https://noprivado.com')
      }
    })

    const buffer = Buffer.from(await response.arrayBuffer())
    const contentType = response.headers.get('content-type')

    const isImage = contentType?.includes('image')
    const isVideo = contentType?.includes('video')

    if (contentType) {
      if (isImage) {
        const ext = extension(contentType || '')
        const filename = toLower(`images/${getFileMd5(buffer)}${ext ? '.' + ext : ''}`)
        const uploaded = await uploadBuffer(filename, buffer, contentType)

        if (!uploaded) return null

        return filename
      }

      if (isVideo) {
        const ext = extension(contentType || '')
        const filename = toLower(`videos/${getFileMd5(buffer)}${ext ? '.' + ext : ''}`)
        const uploaded = await uploadBuffer(filename, buffer, contentType)

        if (!uploaded) return null

        return filename
      }
    }

    return null
  } catch (error) {
    console.error(error)

    return null
  }
}

const getModel = async (id: string, num: number, page = 1, tryAgain = false) => {
  try {
    const response = await site.get(`/model/${num}?page=${page}`)

    if (/realizar login/i.test(response.data)) {
      if (tryAgain) {
        console.error('Login failed')

        return false
      }

      await login()

      return getModel(id, num, page, true)
    }

    const html = response.data

    const regexPreview = /src="(\/img-preview\/[^"]+)"/g
    const matchesPreview = [...html.matchAll(regexPreview)].map((m) => m[1])

    const regexContent = /hash:\s*'([^']+)'/g
    const matchesContent = [...html.matchAll(regexContent)].map((m) => m[1])

    for (let i = 0; i < matchesContent.length; i++) {
      const content = matchesContent[i]
      const preview = matchesPreview[i]

      const contentFile = await downloadFile(content)
      const previewFile = await downloadFile(preview)

      if (contentFile && previewFile) {
        const media = await Media.create({
          id: getId(contentFile),
          type: contentFile.includes('video') ? 'video' : 'photo',
          modelId: id,
          content: contentFile,
          preview: previewFile
        })

        if (media) {
          console.log(media.id, '-', 'OK')
        } else {
          console.log(contentFile, '-', 'ERROR')
        }
      } else {
        console.log(contentFile, '-', 'ERROR')
      }
    }

    const hasNextPage =
      /<button[^>]*onclick="[^"]*?\?page=(\d+)[^"]*"[^>]*>\s*(?:›|&rsaquo;|&#8250;)\s*<\/button>/.test(
        html
      )

    if (hasNextPage) {
      return getModel(id, num, page + 1, tryAgain)
    }

    return true
  } catch (error) {
    console.error(error)

    return false
  }
}

export default defineEventHandler(async (event) => {
  try {
    const { num } = getQuery(event)

    if (num) {
      const model = await Model.getByNum(Number(num))

      if (model && model.data) {
        const { id, num } = model.data || {}

        if (id && num) {
          const success = await getModel(id, num)

          return getSuccess({}, success)
        }
      }
    }

    return getSuccess({}, false)
  } catch (error) {
    return getError(event, error)
  }
})
