export type ToastType = 'success' | 'error' | 'info'

export type Toast = {
  message: string
  type: ToastType
}

export type ToastContextType = {
  showToast: (message: string, type: ToastType, duration?: number) => void
}
