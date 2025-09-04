export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError)
    }
  }
}
