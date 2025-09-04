// import axios from 'axios'
// import { wrapper } from 'axios-cookiejar-support'
// import { CookieJar } from 'tough-cookie'
// import { uploadBuffer } from '../services/firebase/storage'
// import { toLower } from 'lodash-es'
// import { createHash } from 'crypto'
// import { extension } from 'mime-types'
// import { Model } from '../db/Model'

// const jar = new CookieJar()

// const site = wrapper(
//   axios.create({
//     baseURL: 'https://noprivado.com',
//     jar,
//     withCredentials: true,
//     headers: {
//       'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36`,
//       'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
//     }
//   })
// )

// const login = async () => {
//   try {
//     await jar.setCookie('over18=true', 'https://noprivado.com')

//     // 1. GET login page
//     const loginPage = await site.get('/login')
//     const html = loginPage.data

//     const tokenMatch = html.match(/<input type="hidden" value="([a-f0-9]{32})" name="token">/)

//     if (!tokenMatch) {
//       throw new Error('Token não encontrado!')
//     }

//     const token = tokenMatch[1]

//     // 2. POST login
//     const form = new URLSearchParams({
//       username: 'we0606',
//       password: 'so3004',
//       token
//     })

//     const loginResponse = await site.post('/login', form.toString(), {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         Referer: 'https://noprivado.com/login',
//         Origin: 'https://noprivado.com'
//       }
//     })

//     if (!/pesquisar modelo/i.test(loginResponse.data)) {
//       throw new Error('Login falhou!')
//     }

//     return true
//   } catch (error) {
//     console.error('Erro no login:', (error as Error).message)

//     return false
//   }
// }

// const getFileMd5 = (buffer: Buffer) => {
//   return createHash('md5').update(buffer).digest('hex')
// }

// const downloadFile = async (id: string, url: string) => {
//   try {
//     const response = await fetch(`https://noprivado.com${url}`, {
//       headers: {
//         Cookie: jar.getCookieStringSync('https://noprivado.com')
//       }
//     })

//     const buffer = Buffer.from(await response.arrayBuffer())
//     const contentType = response.headers.get('content-type')
//     const isError = contentType?.includes('text/html')
//     const ext = extension(contentType || '')
//     const filename = toLower(`images/${getFileMd5(buffer)}${ext ? '.' + ext : ''}`)

//     if (isError) return false
//     if (!filename) return false
//     if (!contentType) return false

//     const uploaded = await uploadBuffer(filename, buffer, contentType)
//     if (!uploaded) return false

//     return filename
//   } catch (error) {
//     console.error(error)

//     return null
//   }
// }

// const getModel = async (id: number, tryAgain = false) => {
//   try {
//     const response = await site.get(`/model/${id}`)

//     if (/realizar login/i.test(response.data)) {
//       if (tryAgain) {
//         console.error('Login failed')

//         return false
//       }

//       await login()

//       return getModel(id, true)
//     }

//     const html = response.data

//     // 1. Nome
//     const nameMatch = html.match(/<h2>(.*?)<\/h2>/)
//     const name = nameMatch ? nameMatch[1].trim() : ''

//     // 2. Background URL
//     const coverMatch = html.match(/background[^;]+url\((.*?)\)/)
//     const cover = coverMatch ? coverMatch[1] : ''

//     // 3. Imagem URL
//     const avatarMatch = html.match(/<img[^>]+src="(\/contend\/[^"]+)"[^>]*>/)
//     const avatar = avatarMatch ? avatarMatch[1] : ''

//     // 4. País (classe flag-icon-xx)
//     const flagMatch = html.match(/flag-icon flag-icon-([a-z]{2})/)
//     const country = flagMatch ? flagMatch[1] : ''

//     const ulid = getId(String(id))

//     const result = {
//       id: ulid,
//       num: id,
//       name,
//       country,
//       cover: await downloadFile(ulid, cover),
//       avatar: await downloadFile(ulid, avatar)
//     }

//     if (!result.name || !result.cover || !result.avatar) {
//       return false
//     }

//     return await Model.create(ulid, result)
//   } catch (error) {
//     console.error(error)

//     return false
//   }
// }

// process.nextTick(async () => {
//   await login()

//   let i = 1

//   while (true) {
//     const model = await getModel(i)
//     console.error(`${i} - ${model}`)
//     i++
//   }
// })
