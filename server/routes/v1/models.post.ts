import { map, toLower } from 'lodash-es'
import { Model } from '~~/server/db/Model'

export default defineEventHandler(async (event) => {
  let items: any[] = []

  const isLogged = Boolean(await getLogged(event))

  if (isLogged) {
    const { limit = 21, lastId } = (await getRequestData(event)) as {
      limit: number
      lastId: string
    }

    const data = await Model.list({
      limit: Number(limit),
      select: ['id', 'name', 'avatar', 'cover'],
      lastId
    })

    items = map(data, async (model) => ({
      ...model,
      id: toLower(model.id),
      cover: `/files/${model.cover}`,
      avatar: `/files/${model.avatar}`
    }))
  } else {
    const data = await Model.listRandom({
      limit: 12,
      select: ['id', 'name', 'avatar', 'cover']
    })

    items = map(data, async (model) => ({
      ...model,
      id: toLower(model.id),
      cover: `/files/${model.cover}`,
      avatar: `/files/${model.avatar}`
    }))
  }

  return {
    items: await Promise.all(items),
    success: true
  }
})
