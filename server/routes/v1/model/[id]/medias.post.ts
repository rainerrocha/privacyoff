import { map, toLower } from 'lodash-es'
import { Media } from '~~/server/db/Media'

export default defineEventHandler(async (event) => {
  let items: any[] = []

  const modelId = getRouterParam(event, 'id')
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
      limit: Number(limit),
      select: ['id', 'type', 'content', 'preview'],
      lastId,
      modelId
    })

    items = map(data, async (model) => ({
      ...model,
      id: toLower(model.id),
      url: `/files/${model.content}`,
      type: model.type
    }))
  }

  return {
    items: await Promise.all(items),
    success: true
  }
})
