import { ToastType } from './types'
import './style.css'
import { OctagonAlert } from 'lucide-react'

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
        <div className={`toast toast-${toast.type}`}>
          {' '}
          <OctagonAlert />
          {toast.message}
        </div>
      )}
    </div>
  )
}
