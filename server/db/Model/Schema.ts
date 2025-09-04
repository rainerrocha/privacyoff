import { z } from 'zod'
import { Timestamp } from 'firebase-admin/firestore'

const TimestampToDate = z.instanceof(Timestamp).transform((ts) => ts.toDate())

export const ModelSchema = z.object({
  id: z.ulid().uppercase(),
  num: z.number().int().positive(),
  name: z.string().min(1),
  likes: z.number().min(0).default(0),
  views: z.number().min(0).default(0),
  cover: z.string().min(1),
  avatar: z.string().min(1),
  country: z.string().nullish(),
  updatedAt: TimestampToDate,
  createdAt: TimestampToDate
})

export type IModel = z.infer<typeof ModelSchema>
