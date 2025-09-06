import { getId } from '~~/server/utils/getId'
import { type IUser, UserSchema } from './Schema'
export { type IUser, UserSchema } from './Schema'
import { FirestoreModel } from '~~/server/services/firebase/firestoreModel'
import { Timestamp } from 'firebase-admin/firestore'
import { isEqual } from 'lodash-es'

export class User extends FirestoreModel {
  private docId: string = getId()
  private docData: IUser | Partial<IUser> = {}

  constructor() {
    super('users')
  }

  public get id() {
    return this.docId
  }

  public get data() {
    return UserSchema.parse(this.docData)
  }

  static async get(id: string) {
    try {
      if (!id) return null

      const self = new User()
      const data = await self.getDoc(id).get()

      if (data.exists) {
        self.docId = data.id
        self.docData = data.data() as IUser

        return self
      }

      return null
    } catch (error) {
      console.error(error)

      return null
    }
  }

  static async getByEmail(email: string) {
    try {
      const self = new User()
      const data = await self.findOne([['email', '==', email]])

      if (data) {
        self.docId = data.id
        self.docData = data as IUser

        return self
      }

      return null
    } catch (error) {
      console.error(error)

      return null
    }
  }

  listen(callback: (data: IUser) => void) {
    return this.listenDoc(this.id, (data) => callback(data as IUser))
  }

  static async create(requestData: Record<string, any>) {
    const self = new User()

    const data = UserSchema.parse({
      ...requestData,
      id: self.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })

    const result = await self.createData(self.id, data)

    if (result) {
      self.docData = data

      return self
    }

    return null
  }

  async update(requestData: Record<string, any>) {
    return this.updateData(this.id, UserSchema.pick(this.pick(requestData)).parse(requestData))
  }

  async verifyPassword(password: string) {
    if (!password || !this.data.password) return false
    return isEqual(password, this.data.password)
  }

  async hasActiveSubscription() {
    const { status, expiresAt } = this.data.subscription || {}
    return status === 'active' && expiresAt && expiresAt > new Date()
  }

  toJSON() {
    return this.data
  }
}
