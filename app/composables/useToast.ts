export const useToast = () => {
  // Estado global do composable

  const id = useState('toastId', () => 0)
  const data = useState<any>('toastData', () => ({}))
  const timer = useState<number>('toastTimer', () => 0)

  // Função para abrir o toast
  const open = (newData: any = {}) => {
    if (timer.value) clearTimeout(timer.value)

    id.value++
    data.value = newData

    if (newData.buttons) {
      timer.value = 0
    } else {
      timer.value = setTimeout(() => close(), 5000) as unknown as number
    }
  }

  // Função para fechar o toast
  const close = () => {
    if (timer.value) clearTimeout(timer.value)

    id.value = 0
    data.value = {}
  }

  // Retorna o estado e as funções
  return { id, data, timer, open, close }
}
