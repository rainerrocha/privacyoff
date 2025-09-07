import { getId } from '~~/server/utils/getId'
import { type IMedia, MediaSchema } from './Schema'
export { type IMedia, MediaSchema } from './Schema'
import { FirestoreModel } from '~~/server/services/firebase/firestoreModel'
import { Timestamp } from 'firebase-admin/firestore'

export class Media extends FirestoreModel {
  private docId: string = getId()
  private docData: IMedia | Partial<IMedia> = {}

  constructor() {
    super('medias')
  }

  public get id() {
    return this.docId
  }

  public get data() {
    return MediaSchema.parse(this.docData)
  }

  static async get(id: string) {
    try {
      if (!id) return null

      const self = new Media()
      const data = await self.getDoc(id).get()

      if (data.exists) {
        self.docId = data.id
        self.docData = data.data() as IMedia

        return self
      }

      return null
    } catch (error) {
      console.error(error)

      return null
    }
  }

  static async create(requestData: Record<string, any>) {
    const self = new Media()

    const data = MediaSchema.parse({
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
    return this.updateData(this.id, MediaSchema.pick(this.pick(requestData)).parse(requestData))
  }

  toJSON() {
    return this.data
  }
}
