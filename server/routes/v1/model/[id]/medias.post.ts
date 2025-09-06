import { map, toLower } from 'lodash-es'
import { Model } from '~~/server/db/Model'

export default defineEventHandler(async (event) => {
  let items: any[] = []

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

    const data = await Model.list({
      limit: Number(limit),
      select: ['id', 'name', 'avatar'],
      lastId
    })

    items = map(data, async (model) => ({
      ...model,
      id: toLower(model.id),
      url: `/files/${model.avatar}`,
      type: 'photo'
    }))
  }

  return {
    items: await Promise.all(items),
    success: true
  }
})
