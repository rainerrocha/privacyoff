import { type DocumentData, getFirestore, WhereFilterOp } from 'firebase-admin/firestore'
import { app } from './app'
import { assign, each, head, map, mapValues } from 'lodash-es'

export class FirestoreModel {
  protected db = getFirestore(app)
  protected collectionName: string

  constructor(collectionName: string) {
    if (!collectionName) {
      throw new Error('Collection name must be provided.')
    }

    this.collectionName = collectionName
  }

  public get collection() {
    return this.db.collection(this.collectionName)
  }

  protected getCollection() {
    return this.collection
  }

  protected getDoc(id: string) {
    return this.getCollection().doc(id)
  }

  async find(wheres: [string, WhereFilterOp, any][], options: any = {}) {
    try {
      const query = this.collection

      each(wheres, (where) => {
        assign(query, query.where(...where))
      })

      if (options.select) {
        assign(query, query.select(...options.select))
      }

      if (options.limit) {
        assign(query, query.limit(options.limit))
      }

      if (options.orderBy) {
        assign(query, query.orderBy(options.orderBy, options.orderDesc ? 'desc' : 'asc'))
      }

      return map((await query.get()).docs, (doc) => doc.data())
    } catch (error) {
      console.error(error)

      return []
    }
  }

  async findOne(wheres: [string, WhereFilterOp, any][], options: any = {}) {
    const items = await this.find(wheres, options)
    return head(items) || null
  }

  protected async getItems<T = DocumentData>(id: string): Promise<T | null> {
    try {
      const docRef = await this.getDoc(id).get()

      return (docRef.data() as T) || null
    } catch (error) {
      console.error(error)

      return null
    }
  }

  protected async getData<T = DocumentData>(id: string): Promise<T | null> {
    try {
      const docRef = await this.getDoc(id).get()

      return (docRef.data() as T) || null
    } catch (error) {
      console.error(error)

      return null
    }
  }

  async setData(id: string, data: Record<string, unknown>): Promise<boolean> {
    try {
      await this.getDoc(id).set({ ...data, id })

      return true
    } catch (error) {
      console.error(error)

      return false
    }
  }

  async createData(id: string, data: Record<string, unknown>): Promise<boolean> {
    try {
      await this.getDoc(id).create({ ...data, id })

      return true
    } catch (error) {
      console.error(error)

      return false
    }
  }

  async updateData(id: string, data: Record<string, unknown>): Promise<boolean> {
    try {
      await this.getDoc(id).update({ ...data })

      return true
    } catch (error) {
      console.error(error)

      return false
    }
  }

  listenDoc(id: string, callback: (payload: DocumentData | null) => void) {
    return this.getDoc(id).onSnapshot((snapshot) => {
      if (snapshot.exists) {
        callback(snapshot.data() as DocumentData)
      } else {
        callback(null)
      }
    })
  }

  pick(obj: object): any {
    return mapValues(obj, () => true)
  }
}
