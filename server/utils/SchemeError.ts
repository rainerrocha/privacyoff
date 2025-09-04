export class SchemeError extends Error {
  status: number
  details?: Record<string, any>[]

  constructor(message: string, details?: Record<string, any>[]) {
    super(message)
    this.name = 'SchemeError'
    this.status = 422
    this.details = details

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SchemeError)
    }
  }
}
