import { map, take, toLower } from 'lodash-es'
import { Model } from '~~/server/db/Model'
import { useSearch } from '~~/server/utils/search'

const removeAccents = (entry: string) => {
  return entry.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export default defineEventHandler(async (event) => {
  let items: any[] = []

  const isLogged = Boolean(await getLogged(event))

  if (isLogged) {
    const {
      limit = 21,
      search,
      lastId
    } = (await getRequestData(event)) as {
      limit: number
      search: string
      lastId: string
    }

    let data = await Model.list({
      limit: Number(limit),
      select: ['id', 'name', 'avatar', 'cover'],
      search,
      lastId
    })

    if (search) {
      data = useSearch(
        map(data, (item) => ({ ...item, search: removeAccents(item.name) })),
        removeAccents(search),
        { fields: ['search'] }
      )

      data = take(data, Number(limit))
    }

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
