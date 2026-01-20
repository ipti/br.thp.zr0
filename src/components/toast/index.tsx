import { ToastType } from './types'
import './style.css'

type ToastZROProps = {
  toast: {
    message: string
    type: ToastType
  } | null
}

export const ToastZRO: React.FC<ToastZROProps> = ({ toast }) => {
  return (
    <div className={`toast-wrapper ${toast ? 'show' : ''}`}>
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}
    </div>
  )
}
