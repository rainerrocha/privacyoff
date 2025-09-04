import { H3Event, send, setResponseStatus, setResponseHeader } from 'h3'
import { getReasonPhrase } from 'http-status-codes'

export const getError = (event: H3Event, error: any = {}) => {
  const status = error.status || 500
  const statusText = getReasonPhrase(status)

  const errorCode = getReasonPhrase(status).replace(/\s+/g, '_').toUpperCase()
  const errorMessage = error.message || 'Something went wrong on the server.'

  setResponseStatus(event, status, statusText)
  setResponseHeader(event, 'Content-Type', 'application/json')

  const result = {
    error: {
      code: errorCode || 'INTERNAL_SERVER_ERROR',
      status,
      message: errorMessage,
      details: error.details
    },
    success: false
  }

  return send(event, JSON.stringify(result), 'application/json')
}
