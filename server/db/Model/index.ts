import { map, omit, clamp, zipObject, toUpper, shuffle, take } from 'lodash-es'
import { FirestoreModel } from '~~/server/services/firebase/firestoreModel'
import { ModelSchema, type IModel } from './Schema'
import { Query, Timestamp, QueryDocumentSnapshot } from 'firebase-admin/firestore'
export { type IModel, ModelSchema } from './Schema'

export class Model extends FirestoreModel {
  private docId: string = getId()
  private docData: IModel | Partial<IModel> = {}

  constructor(id?: string) {
    super('models')

    this.docId = id || getId()
  }

  public get id() {
    return this.docId
  }

  public get data() {
    return this.docData
  }

  static async get(entry: string) {
    try {
      const id = toUpper(entry)
      const self = new Model(id)
      const data = await self.getDoc(id).get()

      if (data.exists) {
        self.docId = data.id
        self.docData = ModelSchema.parse(data.data())

        return self
      }

      return null
    } catch (error) {
      console.error(error)

      return null
    }
  }

  static async list({
    limit,
    select,
    lastId
  }: { limit?: number; select?: string[]; lastId?: string } = {}) {
    try {
      const db = new Model()

      let query: Query = db.collection.orderBy('num', 'desc')

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

            return ModelSchema.pick(pick).parse(doc.data())
          } else {
            return ModelSchema.parse(doc.data())
          }
        })
      }

      return []
    } catch (error) {
      console.error(error)

      return []
    }
  }

  static async listRandom({
    limit = Number.MAX_SAFE_INTEGER,
    select
  }: { limit?: number; select?: string[] } = {}) {
    try {
      const db = new Model()

      let query: Query = db.collection.select('id')
      let snapshot = await query.get()

      const ids = map(take(shuffle(snapshot.docs), limit), 'id')

      query = select ? db.collection.select(...select) : db.collection
      snapshot = await query.where('id', 'in', ids).get()

      if (snapshot.size > 0) {
        return map(snapshot.docs, (doc) => {
          if (select) {
            const pick = zipObject(select, Array(select.length).fill(true))

            return ModelSchema.pick(pick).parse(doc.data())
          } else {
            return ModelSchema.parse(doc.data())
          }
        })
      }

      return []
    } catch (error) {
      console.error(error)

      return []
    }
  }

  static async create(id: string, requestData: Record<string, any>) {
    const self = new Model(id)

    const data = ModelSchema.parse({
      ...requestData,
      id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })

    return self.createData(id, data)
  }

  toJSON() {
    return omit(this.docData, ['api'])
  }
}
