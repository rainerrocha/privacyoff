import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.ulid().uppercase(),
  email: z.email(),
  password: z.string().min(1),

  subscription: z
    .object({
      id: z.string().nullish(),
      status: z.enum(['active', 'pending']).default('pending'),
      period: z
        .enum(['monthly', 'quarterly', 'semiannual', 'annual', 'lifetime'])
        .default('monthly'),
      qrCode: z.string().nullish(),
      expiresAt: z
        .union([z.instanceof(Timestamp).transform((ts) => ts.toDate()), z.instanceof(Date)])
        .default(new Date())
    })
    .nullish(),

  updatedAt: z
    .union([z.instanceof(Timestamp).transform((ts) => ts.toDate()), z.instanceof(Date)])
    .default(new Date()),

  createdAt: z
    .union([z.instanceof(Timestamp).transform((ts) => ts.toDate()), z.instanceof(Date)])
    .default(new Date())
})

export type IUser = z.infer<typeof UserSchema>
