import { map, set, size, sortBy, unset } from 'lodash-es'

export const useLoader = () => {
  const data = useState('loader', () => ({}))
  const isLoading = computed(() => size(sortBy(map(data.value))) > 0)

  const start = (name: string) => {
    set(data.value, name, Date.now())

    return {
      stop: () => unset(data.value, name)
    }
  }

  return {
    start,
    isLoading
  }
}
