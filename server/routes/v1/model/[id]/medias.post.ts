import { map, toLower, toUpper } from 'lodash-es'
import { Media } from '~~/server/db/Media'

export default defineEventHandler(async (event) => {
  let items: any[] = []

  const modelId = toUpper(getRouterParam(event, 'id'))
  const isLogged = Boolean(await getLogged(event))

  if (isLogged) {
    const {
      type,
      limit = 20,
      lastId
    } = (await getRequestData(event)) as {
      type: 'photo' | 'video'
      limit: number
      lastId: string
    }

    const data = await Media.list({
      type,
      limit: Number(limit),
      select: ['id', 'type', 'content', 'preview'],
      lastId,
      modelId
    })

    items = map(data, async (model) => ({
      ...model,
      id: toLower(model.id),
      type: model.type,
      preview: `/files/${model.preview}`,
      content: `/files/${model.content}`
    }))
  }

  return {
    items: await Promise.all(items),
    success: true
  }
})
