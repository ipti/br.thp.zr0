'use client'

import { createContext, useRef, useState, ReactNode } from 'react'

import { Toast, ToastContextType, ToastType } from '../types'
import { ToastZRO } from '..'

export const ToastContext = createContext<ToastContextType | null>(null)

interface IToastProvider {
  children: ReactNode
}

export const ToastProvider: React.FC<IToastProvider> = ({ children }) => {
  const [toast, setToast] = useState<Toast | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const showToast = (message: string, type: ToastType, duration = 3000) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setToast({ message, type })

    timeoutRef.current = window.setTimeout(() => {
      setToast(null)
    }, duration)
  }
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastZRO toast={toast} />
    </ToastContext.Provider>
  )
}
