import { getId } from '~~/server/utils/getId'
import { type IMedia, MediaSchema } from './Schema'
export { type IMedia, MediaSchema } from './Schema'
import { FirestoreModel } from '~~/server/services/firebase/firestoreModel'
import { Query, Timestamp } from 'firebase-admin/firestore'
import { clamp, map, toUpper } from 'lodash-es'
import { zipObject } from 'lodash-es'

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

  static async list({
    type,
    limit,
    select,
    lastId,
    modelId
  }: {
    type?: 'photo' | 'video'
    limit?: number
    select?: string[]
    lastId?: string
    modelId?: string
  } = {}) {
    try {
      const db = new Media()

      let query: Query = db.collection.orderBy('createdAt', 'desc').where('modelId', '==', modelId)

      if (type) {
        query = query.where('type', '==', type)
      }

      if (limit) {
        query = query.limit(clamp(limit, 1, 100))
      } else {
        query = query.limit(21)
      }

      if (select) {
        query = query.select(...select)
      }

      if (lastId) {
        const lastDoc = await db.getDoc(toUpper(lastId)).get()

        if (lastDoc.exists) {
          query = query.startAfter(lastDoc)
        }
      }

      const snapshot = await query.get()

      if (snapshot.size > 0) {
        return map(snapshot.docs, (doc) => {
          if (select) {
            const pick = zipObject(select, Array(select.length).fill(true))

            return MediaSchema.pick(pick).parse(doc.data())
          } else {
            return MediaSchema.parse(doc.data())
          }
        })
      }

      return []
    } catch (error) {
      console.error(error)

      return []
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
