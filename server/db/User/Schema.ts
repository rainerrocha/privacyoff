import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.ulid().uppercase(),
  email: z.email(),
  password: z.string().min(1),

  subscription: z
    .object({
      period: z
        .enum(['monthly', 'quarterly', 'semiannual', 'annual', 'lifetime'])
        .default('monthly'),
      expiresAt: z
        .instanceof(Timestamp)
        .transform((ts) => ts.toDate())
        .default(Timestamp.now().toDate())
    })
    .nullish(),

  updatedAt: z
    .instanceof(Timestamp)
    .transform((ts) => ts.toDate())
    .default(Timestamp.now().toDate()),

  createdAt: z
    .instanceof(Timestamp)
    .transform((ts) => ts.toDate())
    .default(Timestamp.now().toDate())
})

export type IUser = z.infer<typeof UserSchema>
