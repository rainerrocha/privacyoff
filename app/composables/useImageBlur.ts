import { replace } from 'lodash-es'

export const useImageBlur = (image: string, onlySubscription: boolean = false) => {
  const user = useUser()
  const isLogged = user.isLogged.value
  const hasActiveSubscription = user.data.value?.subscription?.status === 'active'
  const blurImage = replace(image, '/images/', '/images/blur/')

  return isLogged
    ? onlySubscription
      ? hasActiveSubscription
        ? image
        : blurImage
      : image
    : blurImage
}
