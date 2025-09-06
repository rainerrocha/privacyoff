export const closeModal = async () => {
  try {
    const win = window as any

    win.closeModal()

    return true
  } catch {
    return false
  }
}
