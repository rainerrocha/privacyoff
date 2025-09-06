export const useUser = () => {
  // Estado global do composable
  const ssid = useState('ssid', () => useCookie('__session'))
  const data = useState<Record<string, any>>('user', () => ({}))

  // Getter para verificar se o usuário está  logado
  const isLogged = computed(() => Boolean(ssid.value && data.value?.id))

  // Getter para verificar se o usuário tem uma assinatura ativa
  const hasActiveSubscription = computed(() => data.value?.subscription?.status === 'active')

  // Função para pegar os dados do usuário
  const getData = async () => {
    const loader = useLoader().start('user')

    try {
      const { data } = await useApi('/v1/user')

      return setData(data || {})
    } catch {
      return setData()
    } finally {
      loader.stop()
    }
  }

  // Função para definir os dados do usuário
  const setData = (newData: Record<string, any> = {}) => {
    data.value = newData || {}

    return data.value
  }

  // Retorna o estado e as funções
  return {
    ssid,
    data,
    getData,
    setData,
    isLogged,
    hasActiveSubscription
  }
}
