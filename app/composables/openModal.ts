export const openModal = (modal: string) => {
  try {
    const win = window as any

    win[`${modal}Modal`]?.open()

    return true
  } catch {
    return false
  }
}
