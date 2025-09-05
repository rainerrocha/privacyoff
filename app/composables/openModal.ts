export const openModal = async (modal: string) => {
  try {
    const win = window as any

    if (win.opendedModal) {
      win.opendedModal.close()
      await new Promise((resolve) => setTimeout(resolve, 150))
    }

    win.opendedModal = win[`${modal}Modal`]
    win.opendedModal.open()

    return true
  } catch {
    return false
  }
}
