import { useContext } from 'react'

import { ToastContext } from '../context'

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast está sendo usado sem um contexto')
  return context
}
