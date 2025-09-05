export default defineEventHandler(async (event) => {
  try {
    return getSuccess({ status: 'pending' })
  } catch (error) {
    return getError(event, error)
  }
})
