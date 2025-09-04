import { replace } from 'lodash-es'

export const useImageBlur = (image: string) => {
  return useUser().isLogged.value ? image : replace(image, '/images/', '/images/blur/')
}
