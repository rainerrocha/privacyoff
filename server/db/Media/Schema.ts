import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'

export const MediaSchema = z.object({
  id: z.ulid().uppercase(),
  type: z.enum(['photo', 'video']),
  modelId: z.ulid().uppercase(),
  content: z.string().min(1),
  preview: z.string().min(1),

  updatedAt: z
    .union([z.instanceof(Timestamp).transform((ts) => ts.toDate()), z.instanceof(Date)])
    .default(new Date()),

  createdAt: z
    .union([z.instanceof(Timestamp).transform((ts) => ts.toDate()), z.instanceof(Date)])
    .default(new Date())
})

export type IMedia = z.infer<typeof MediaSchema>
