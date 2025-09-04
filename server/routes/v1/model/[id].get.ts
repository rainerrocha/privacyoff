import { toLower } from 'lodash-es'
import { Model } from '~~/server/db/Model'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

  const db = await Model.get(id)
  const data = db?.data

  if (!data) {
    return getError(event, { status: 404, message: 'Model not found' })
  }

  return {
    data: {
      ...data,
      id: toLower(data.id),
      cover: `/files/${data.cover}`,
      avatar: `/files/${data.avatar}`
    },
    success: true
  }
})
