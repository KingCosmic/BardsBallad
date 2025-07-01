import { newRidgeState } from 'react-ridge-state'
import { v4 as uuid } from 'uuid'

export const toastState = newRidgeState<{ id: string, message: string, type: 'success' | 'error' }[]>([])

export const removeToast = (id: string) => {
  toastState.set((prev) => prev.filter((toast) => toast.id !== id))
}

export const addToast = (message: string, type: 'success' | 'error' = 'success', duration = 3000) => {
  const id = uuid()
  toastState.set((prev) => [...prev, { id, message, type }])

  setTimeout(() => removeToast(id), duration)
}