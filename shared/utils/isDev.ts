export const isDev = () => {
  try {
    return Boolean(import.meta.dev)
  } catch {
    return false
  }
}
