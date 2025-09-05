import { toast } from 'vue-sonner'

export const useToast = (
  type: 'success' | 'error' | 'warning' | 'info' | 'message' | 'default',
  message: string,
  options: Record<string, any> = {}
) => {
  if (type === 'success') {
    toast.success(message, options)
  } else if (type === 'error') {
    toast.error(message, options)
  } else if (type === 'warning') {
    toast.warning(message, options)
  } else if (type === 'info') {
    toast.info(message, options)
  } else if (type === 'message') {
    toast.message(message, options)
  } else {
    toast(message, options)
  }
}
