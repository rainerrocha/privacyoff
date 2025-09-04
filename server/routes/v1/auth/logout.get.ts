export default defineEventHandler((event) => {
  try {
    setSession(event)

    return getSuccess()
  } catch (error) {
    return getError(event, error)
  }
})
